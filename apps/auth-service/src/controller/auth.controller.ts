import { NextFunction, Request, Response } from "express";
import { checkOtpRestrictions, handleForgotPassword, sendOtp, trackOtpRequest, validateRegistrationData, verifyForgotPasswordOtp, verifyOtp } from "../utils/auth.helper";
import prisma from "@packages/libs/prisma";
import { AuthError, ValidationError } from "@packages/error-handler";
import bcrypt from 'bcryptjs';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import { setCookie } from "../utils/cookies/setCookie";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-04-30.basil'
})


// Register a new user
export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, 'user');

        const { name, email } = req.body;

        const exisitngUser = await prisma.users.findUnique({ where: { email } });

        if (exisitngUser) {
            return next(new ValidationError("User already exist with this email"));
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequest(email, next);
        await sendOtp(name, email, 'user-activation-mail');

        res.status(200).json({
            message: 'OTP sent to email.Please verify your account'
        })
    } catch (error) {
        return next(error);
    }

}


// verify user with otp
export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, otp, password } = req.body;

        if (!email || !otp || !password || !name) {
            return next(new ValidationError("All fields are required!!"));
        }

        const exisitngUser = await prisma.users.findUnique({ where: { email } });

        if (exisitngUser) {
            return next(new ValidationError("User already exist with this email"));
        }

        await verifyOtp(email, otp, next);
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })

        res.status(201).json({
            success: true,
            message: "User registered successfully!"
        });

    } catch (error) {
        return next(error);
    }
}

// login user
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and password are required"));
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return next(new AuthError("User dosen't exists!"));
        }

        //verify password

        const isMatch = await bcrypt.compare(password, user.password!);

        if (!isMatch) {
            return next(new AuthError("Invalid email or Password"));
        }

        res.clearCookie('seller-access-token');
        res.clearCookie('seller-refresh-token');

        //Generate access and refresh token
        const accessToken = jwt.sign({ id: user.id, role: 'user' },
            process.env.ACCESS_TOKEN_SECRET as string, {
            expiresIn: '15m'
        })

        const refreshToken = jwt.sign({ id: user.id, role: 'user' },
            process.env.REFRESH_TOKEN_SECRET as string, {
            expiresIn: '7d'
        });

        //store the refresh and access token in an httpOnly secure cookie
        setCookie(res, "refresh_token", refreshToken);
        setCookie(res, "access_token", accessToken);

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, email: user.email, name: user.name }
        })

    } catch (error) {
        return next(error)
    }
}

//refresh token
export const refreshToken = async (req: any, res: Response, next: NextFunction) => {
    try {
        const refreshToken = req.cookies['refresh_token'] || req.cookies['seller-refresh-token'] || req.headers.authorization?.split(" ")[1];


        if (!refreshToken) {
            return new ValidationError("Unauthorized! No refresh token.");
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as { id: string; role: string }

        if (!decoded || decoded.id || !decoded.role) {
            return new JsonWebTokenError(`Forbidden! Invalid refresh token.`);
        }

        let account;

        if (decoded.role === 'user') {
            account = await prisma.users.findUnique({ where: { id: decoded.id } });
        } else if (decoded.role === 'seller') {
            account = await prisma.sellers.findUnique({ where: { id: decoded.id }, include: { Shop: true } })
        }

        if (!account) {
            return new AuthError("Forbidden! User/seller not found");
        }

        const newAccessToken = jwt.sign({
            id: decoded.id, role: decoded.role
        },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "15m" }
        )

        if (decoded.role === 'user') {
            setCookie(res, "access_token", newAccessToken);
        } else if (decoded.role === 'seller') {
            setCookie(res, "seller-access_token", newAccessToken);

        }

        req.role = decoded.role;

        return res.status(201).json({ success: true });


    } catch (error) {
        return next(error);
    }
}

// Get logged in user
export const getUser = async (req: any, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        res.status(201).json({ success: true, user });
    } catch (error) {
        next(error);
    }
}

//user forgot password
export const userForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await handleForgotPassword(req, res, next, 'user');
}

//Verify forgot password OTP
export const verifyUserForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    await verifyForgotPasswordOtp(req, res, next);
}

// Reset user password
export const resetUserPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return next(new ValidationError("Email and newPassword are required"));
        }

        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
            return next(new ValidationError("User not found!"));
        }

        //Compare new Password with the exisiting one

        const isSamePassword = await bcrypt.compare(newPassword, user.password!);

        if (isSamePassword) {
            return next(new ValidationError("New password cannot be the same as old password!"))
        }

        //hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.users.update({
            where: { email },
            data: { password: hashedPassword }
        });

        res.status(200).json({ message: "Password reset successfully!" });

    } catch (error) {
        next(error);
    }
}

// register a new seller
export const registerSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validateRegistrationData(req.body, 'seller');
        const { name, email } = req.body;

        const exisitngSeller = await prisma.sellers.findUnique({ where: { email } });

        if (exisitngSeller) {
            throw new ValidationError("Seller already exists with this email");
        }

        await checkOtpRestrictions(email, next);
        await trackOtpRequest(email, next);
        await sendOtp(name, email, 'seller-activation');

        res.status(200).json({ message: "OTP sent to email. Please verify your account." });

    } catch (error) {
        next(error);
    }
}

// verify seller with OTP
export const verifySeller = async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp, password, name, phone_number, country } = req.body;

    if (!email || !otp || !password || !name || !phone_number || !country) {
        return next(new ValidationError("All fields are Required"));
    }

    const exisitngSeller = await prisma.sellers.findUnique({ where: { email } });

    if (exisitngSeller) {
        throw new ValidationError("Seller already exists with this email");
    }

    await verifyOtp(email, otp, next);
    const hashedPassword = await bcrypt.hash(password, 10);

    const seller = await prisma.sellers.create({
        data: {
            name,
            email,
            password: hashedPassword,
            country,
            phone_number,
        }
    });

    res.status(201).json({ seller, message: "Seller registered successfully!" });
}

// create a new shop
export const createShop = async (req: Request, res: Response, next: NextFunction) => {
    const { name, bio, address, opening_hours, website, category, sellerId } = req.body;

    console.log(req.body);

    if (!name || !bio || !address || !sellerId || !opening_hours || !category) {
        return next(new ValidationError("All fields are required"));
    }

    const shopData: any = {
        name,
        bio,
        address,
        opening_hours,
        category,
        sellerId
    }

    if (website && website.trim() !== "") {
        shopData.website = website;
    }

    const shop = await prisma.shops.create({ data: shopData });

    res.status(201).json({ success: true, shop });
}

// create strip connect account link
export const createStripeConnectLink = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { sellerId } = req.body;

        if (!sellerId) {
            return next(new ValidationError("Seller ID is required"));
        }

        const seller = await prisma.sellers.findUnique({ where: { id: sellerId } });

        if (!seller) {
            return next(new ValidationError("Seller is not available with this id!"));
        }

        const account = await stripe.accounts.create({
            type: "express",
            email: seller?.email,
            country: "GB",
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            }
        });

        await prisma.sellers.update({
            where: { id: sellerId }, data: {
                stripeId: account.id,
            }
        });

        const accountLink = await stripe.accountLinks.create({
            account: account.id,
            refresh_url: `http://localhost:3000/success`,
            return_url: 'http://localhost:3000/success',
            type: "account_onboarding"
        });

        res.json({ url: accountLink.url });

    } catch (error) {
        return next(error);
    }
}

// login seller
export const loginSeller = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new ValidationError("Email and Password are required"));
        }

        const seller = await prisma.sellers.findUnique({ where: { email } });

        if (!seller) {
            return next(new ValidationError("Invalid email or password"));
        }

        // verify password
        const isMatch = await bcrypt.compare(password, seller.password!);

        if (!isMatch) {
            return next(new ValidationError("Invalid email or password!"));
        }

        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        const accessToken = jwt.sign(
            { id: seller.id, role: 'seller' },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: seller.id, role: 'seller' },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: '7d' }
        );

        // store tokens in cookie
        setCookie(res, 'seller-refresh-token', refreshToken);
        setCookie(res, 'seller-access-token', accessToken);

        res.status(200).json({
            message: "Login successful!",
            seller: { id: seller.id, email: seller.email, name: seller.name },
        });

    } catch (error) {
        return next(error);
    }
}

// get logged in seller
export const getSeller = async (req: any, res: Response, next: NextFunction) => {
    try {
        const seller = req.seller;
        res.status(201).json({
            success: true,
            seller,
        })
    } catch (error) {
        next(error);
    }
}