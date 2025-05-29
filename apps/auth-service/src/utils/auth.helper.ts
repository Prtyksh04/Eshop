import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { ValidationError } from '@packages/error-handler';
import redis from '@packages/redis';
import { sendEmail } from './sendMail';
import prisma from '@packages/libs/prisma';


const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistrationData = (data: any, userType: 'user' | 'seller') => {
    const { name, email, password, phone_number, country } = data;

    if (!name || !email || !password || (userType === 'seller' && (!phone_number || !country))) {
        throw new ValidationError(`Missing required Fields!`)
    }

    if (!emailRegex.test(email)) {
        throw new ValidationError('Invalid email format!');
    }
};

export const checkOtpRestrictions = async (email: string, next: NextFunction) => {
    if (await redis.get(`otp_lock:${email}}`)) {
        return next(new ValidationError("Account locked due to multiple attempts ! Try again after 30 mins"))
    }

    if (await redis.get(`otp_spam_lock:${email}`)) {
        return next(new ValidationError('Too Many OTP requests! Please wait an hour before requesting again'))
    }

    if (await redis.get(`otp_cooldown:${email}`)) {
        return next(new ValidationError("Please wait 1 minute before requesting a new OTP!"))
    }
}

export const sendOtp = async (name: string, email: string, template: string) => {
    const otp = crypto.randomInt(1000, 9999).toString();

    await sendEmail(email, "Verify Your Email", template, { name, otp });
    await redis.set(`otp:${email}`, otp, 'EX', 300);
    await redis.set(`otp_cooldown:${email} `, "true", 'EX', 60);
}

export const trackOtpRequest = async (email: string, next: NextFunction) => {
    const otpRequestKey = `otp_request_count:${email}`;
    let otpRequest = parseInt((await redis.get(otpRequestKey)) || '0')

    if (otpRequest >= 2) {
        await redis.set(`otp_spam_lock:${email}`, 'locked', 'EX', 3600);    // Lock for one hour
        return next(new ValidationError('Too many OTP request . please wait 1 hour before requesting again'))
    }

    await redis.set(otpRequestKey, otpRequest + 1, 'EX', 3600);
}

export const verifyOtp = async (email: string, otp: string, next: NextFunction) => {
    const storedOtp = await redis.get(`otp:${email}`);

    if (!storedOtp) {
        throw new ValidationError("Invalid or expired OTP!!");
    }

    const failedAttemptsKey = `otp_attempts:${email}`;
    const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || '0');

    if (storedOtp !== otp) {
        if (failedAttempts >= 2) {
            await redis.set(`otp_lock:${email}`, 'locked', 'EX', 1800);    // Lock Otp for 30 mins
            await redis.del(`otp:${email}`, failedAttemptsKey);
            throw new ValidationError("Too many failed attempts. Your account is locked for 30 minutes!");
        }

        await redis.set(failedAttemptsKey, failedAttempts + 1, 'EX', 300);
        throw new ValidationError(`Incorrect OTP. ${2 - failedAttempts} attempts left`)
    }

    await redis.del(`otp:${email}`, failedAttemptsKey);
}

export const handleForgotPassword = async (req: Request, res: Response, next: NextFunction, userType: 'user' | 'seller') => {
    try {

        const { email } = req.body;

        if (!email) throw new ValidationError("Error is required");

        //Find user/seller in db
        const user = userType === 'user' ? await prisma.users.findUnique({ where: { email } }) : await prisma.sellers.findUnique({ where: { email } });

        if (!user) throw new ValidationError(`${userType} not found!`);

        //Check otp restrictions
        await checkOtpRestrictions(email, next);
        await trackOtpRequest(email, next);

        //generate OTP and send OTP
        await sendOtp(user.name, email, userType === 'user' ? 'forgot-password-user-mail' : 'forgot-password-seller-mail');

        res.status(200).json({
            message: 'OTP send to email. Please verify your account'
        });

    } catch (error) {
        next(error);
    }
}

export const verifyForgotPasswordOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            throw new ValidationError("Email and OTP are required");
        }

        await verifyOtp(email, otp, next);
        res.status(200).json({
            message: "Otp verified. You can now reset your password"
        })

    } catch (error) {
        next(error);
    }
}

