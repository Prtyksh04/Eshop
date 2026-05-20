'use client'

import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { countries } from 'apps/seller-ui/src/utils/countries';
import CreateShop from 'apps/seller-ui/src/shared/modules/auth/create-shop';



const Signup = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [canResend, setCanResend] = useState(false);
    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [sellerData, setSellerData] = useState<FormData | null>(null);
    const [sellerId, setSellerId] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);


    const { register, handleSubmit, formState: { errors } } = useForm();

    const startResendTime = () => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            })
        }, 1000);
    }

    const signupMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/seller-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setSellerData(formData)
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTime();
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!sellerData) return;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-seller`, {
                ...sellerData,
                otp: otp.join(""),
            });
            return response.data;
        },
        onSuccess: (data) => {
            setSellerId(data?.seller?.id);
            setActiveStep(2);
        },
    });

    const onSubmit = (data: any) => {
        signupMutation.mutate(data);
    }

    const handleOtpChange = (index: number, value: string) => {
        if (!/^[0-9]$/.test(value)) return; // Only allow digits 0-9
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < inputRefs.current.length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            const newOtp = [...otp];

            if (otp[index]) {
                // Clear current digit
                newOtp[index] = "";
                setOtp(newOtp);
            } else if (index > 0) {
                // Move focus to the previous input
                inputRefs.current[index - 1]?.focus();

                // Also clear the previous input
                newOtp[index - 1] = "";
                setOtp(newOtp);
            }
        }
    }

    const resendOtp = () => {
        if (sellerData) {
            signupMutation.mutate(sellerData);
        }
    }

    const connectStripe = async () => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-stripe-link`, {
                sellerId
            });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Stripe Connection Error : ", error);
        }
    }


    return (
        <div className="w-full flex flex-col items-center pt-10 min-h-screen bg-slate-50">
            <div className='text-center mb-6'>
                <h1 className='text-4xl font-bold text-slate-900'>
                    Join Vendora
                </h1>
                <p className='text-lg text-slate-500 mt-2'>
                    Start selling with AI-powered tools
                </p>
            </div>

            {/* Stepper */}

            <div className='relative flex items-center justify-between w-[90%] md:w-[600px] mb-10 mt-4'>
                <div className='absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-slate-200 -z-10 rounded-full' />
                <div 
                    className='absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-blue-600 -z-10 rounded-full transition-all duration-500' 
                    style={{ width: `${(activeStep - 1) * 50}%` }}
                />
                
                {[1, 2, 3].map((step) => (
                    <div key={step} className="flex flex-col items-center relative">
                        <div className={`w-12 h-12 flex items-center justify-center rounded-full text-white font-bold text-lg shadow-sm transition-colors duration-300 ${step <= activeStep ? "bg-blue-600 ring-4 ring-blue-100" : "bg-slate-200 text-slate-500"}`}>
                            {step}
                        </div>
                        <span className={`absolute -bottom-7 w-max text-sm font-medium ${step <= activeStep ? 'text-blue-700' : 'text-slate-500'}`}>
                            {step === 1 ? "Account" : step === 2 ? "Shop Details" : "Payments"}
                        </span>
                    </div>
                ))}
            </div>

            {/* Steps content */}
            <div className='w-full max-w-[550px] p-8 bg-white shadow-lg border border-slate-100 rounded-xl mb-12 mt-6'>
                {activeStep === 1 && (
                    <>
                        {!showOtp ? (
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <h3 className='text-2xl font-semibold text-center text-slate-900 mb-6'>
                                    Create Your Account
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className='block text-sm font-medium text-slate-700 mb-1'>Full Name</label>
                                        <input type="text"
                                            placeholder='John Doe'
                                            className='w-full p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                                            {...register("name", {
                                                required: "Name is required",
                                            })}
                                        />
                                        {errors.name && <p className='text-red-500 text-sm mt-1'>{String(errors.name.message)}</p>}
                                    </div>
                                    
                                    <div>
                                        <label className='block text-sm font-medium text-slate-700 mb-1'>Phone Number</label>
                                        <input
                                            type="tel"
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            {...register("phone_number", {
                                                required: "Phone Number is Required",
                                                pattern: {
                                                    value: /^\+?[1-9]\d{1,14}$/,
                                                    message: "Invalid format",
                                                },
                                                minLength: {
                                                    value: 10,
                                                    message: "Min 10 digits",
                                                },
                                                maxLength: {
                                                    value: 15,
                                                    message: "Max 15 digits",
                                                },
                                            })}
                                        />
                                        {errors.phone_number && (
                                            <p className='text-red-500 text-sm mt-1'>
                                                {String(errors.phone_number.message)}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-slate-700 mb-1'>Email Address</label>
                                    <input type="email"
                                        placeholder='seller@vendora.com'
                                        className='w-full p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                                message: "Invalid email address"
                                            }
                                        })}
                                    />
                                    {errors.email && <p className='text-red-500 text-sm mt-1'>{String(errors.email.message)}</p>}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-slate-700 mb-1'>Country</label>
                                    <select
                                        className='w-full p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                                        {...register("country", { required: "Country is required" })}
                                    >
                                        <option value="">Select your country</option>
                                        {countries.map((country) => (
                                            <option key={country.code} value={country.code}>
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors.country && (
                                        <p className='text-red-500 text-sm mt-1'>
                                            {String(errors.country.message)}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-slate-700 mb-1'>Password</label>
                                    <div className='relative'>
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            placeholder='••••••••'
                                            className='w-full p-2.5 bg-slate-50 border border-slate-200 text-slate-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all'
                                            {...register("password", {
                                                required: "Password is required",
                                                minLength: {
                                                    value: 6,
                                                    message: "Must be at least 6 characters"
                                                }
                                            })}
                                        />
                                        <button type='button' onClick={() => { setPasswordVisible(!passwordVisible) }} className='absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors'>
                                            {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                        </button>
                                    </div>
                                    {errors.password && <p className='text-red-500 text-sm mt-1'>{String(errors.password.message)}</p>}
                                </div>
                                
                                <div className="pt-2">
                                    <button type='submit'
                                        disabled={signupMutation.isPending}
                                        className='w-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex justify-center items-center'
                                    >
                                        {signupMutation.isPending ? (
                                            <div className='h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                        ) : "Continue"}
                                    </button>
                                </div>
                                
                                {signupMutation.isError &&
                                    signupMutation.error instanceof AxiosError && (
                                        <div className='text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg'>
                                            {signupMutation.error.response?.data?.message ||
                                                signupMutation.error.message
                                            }
                                        </div>
                                    )}
                                <p className='pt-4 text-center text-slate-600'>
                                    Already have an account?{' '}
                                    <Link href={"/login"} className='text-blue-600 font-medium hover:underline'>
                                        Sign In
                                    </Link>
                                </p>
                            </form>
                        ) : (
                            <div className="py-4">
                                <h3 className='text-center mb-2 font-semibold text-2xl text-slate-900'>Verify Email</h3>
                                <p className='text-center text-slate-500 mb-8'>We've sent a 4-digit code to your email.</p>
                                
                                <div className='flex justify-center gap-4 sm:gap-6'>
                                    {otp?.map((digit, index) => (
                                        <input
                                            type="text"
                                            key={index}
                                            ref={(el) => {
                                                if (el) {
                                                    inputRefs.current[index] = el;
                                                }
                                            }}
                                            maxLength={1}
                                            className='w-14 h-14 text-2xl font-bold text-center bg-slate-50 border border-slate-200 outline-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all'
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                        />
                                    ))}
                                </div>
                                <button 
                                    className='w-full mt-8 text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex justify-center items-center'
                                    disabled={verifyOtpMutation.isPending}
                                    onClick={() => verifyOtpMutation.mutate()}
                                >
                                    {verifyOtpMutation.isPending ? (
                                        <div className='h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                    ) : "Verify OTP"}
                                </button>
                                <div className='text-center text-sm mt-6 text-slate-600'>
                                    {canResend ? (
                                        <button
                                            onClick={resendOtp}
                                            className='text-blue-600 font-medium hover:underline'
                                        >
                                            Resend Code
                                        </button>
                                    ) : (
                                        <span className='text-slate-400'>Resend code in {timer}s</span>
                                    )}
                                </div>
                                {
                                    verifyOtpMutation.isError &&
                                    verifyOtpMutation.error instanceof AxiosError && (
                                        <div className='text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg'>
                                            {verifyOtpMutation.error.response?.data?.message ||
                                                verifyOtpMutation.error.message
                                            }
                                        </div>
                                    )}
                            </div>
                        )}
                    </>
                )}
                {activeStep === 2 && (
                    <CreateShop
                        sellerId={sellerId}
                        setActiveStep={setActiveStep}
                    />
                )}
                {activeStep === 3 && (
                    <div className='text-center py-6'>
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h3 className='text-2xl font-bold text-slate-900 mb-2'>Shop Created!</h3>
                        <p className='text-slate-500 mb-8'>Just one more step. Connect your bank account to start receiving payouts.</p>
                        
                        <button
                            className='w-full flex items-center justify-center gap-3 text-lg font-semibold bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-lg transition-colors'
                            onClick={connectStripe}
                        >
                            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13.976 9.15c-2.172-.806-3.356-1.143-3.356-2.077 0-.835.88-1.42 2.188-1.42 1.488 0 2.593.473 3.483.992l1.096-3.328c-.83-.437-2.316-.92-4.484-.92-3.766 0-6.42 1.96-6.42 5.253 0 3.738 5.275 4.312 5.275 6.012 0 .914-.946 1.57-2.5 1.57-1.85 0-3.376-.667-4.52-1.353l-1.127 3.496c1.11.597 2.923 1.107 5.228 1.107 4.12 0 6.643-1.996 6.643-5.344.002-3.213-4.59-4.22-4.59-5.918z" />
                            </svg>
                            Connect with Stripe
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Signup;

