'use client'
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import GoogleButton from '../../shared/components/google-button';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type FormData = {
    email: string;
    name: string,
    password: string;
}

const Signup = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [showOtp, setShowOtp] = useState(false);
    const [timer, setTimer] = useState(60);
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [userData, setUserData] = useState<FormData | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/user-registration`, data);
            return response.data;
        },
        onSuccess: (_, formData) => {
            setUserData(formData)
            setShowOtp(true);
            setCanResend(false);
            setTimer(60);
            startResendTime();
        }
    })

    const verifyOtpMutation = useMutation({
        mutationFn: async () => {
            if (!userData) return;
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/verify-user`, {
                ...userData,
                otp: otp.join(""),
            });
            return response.data;
        },
        onSuccess: () => {
            router.push('/login');
        },
    });

    const onSubmit = (data: FormData) => {
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
        if (userData) {
            signupMutation.mutate(userData);
        }
    }


    return (
        <div className='w-full py-10 min-h-[85vh] bg-[#f1f1f1]'>
            <h1 className='text-center text-4xl font-semibold text-black font-poppins'>
                Signup
            </h1>
            <p className='text-center text-lg font-medium py-3 text-[#00000099]'>
                Home . Signup
            </p>
            <div className='w-full flex justify-center'>
                <div className='md:w-[480px] p-8 bg-white shadow rounded-lg'>
                    <h3 className='text-3xl font-semibold text-center mb-2'>
                        Signup to Ecom
                    </h3>
                    <p className='text-center text-grey-400 mb-4'>
                        Already have an accound?
                        <Link href={'/login'} className='text-blue-500'>
                            Login
                        </Link>
                    </p>
                    <GoogleButton />
                    <div className='flex items-center justify-center my-5 text-gray-400 text-sm'>
                        <div className='flex-1 border-t border-gray-300' />
                        <span className='px-3'>or Sign in with Email</span>
                        <div className='flex-1 border-t border-gray-300' />
                    </div>
                    {!showOtp ? (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <label className='block text-gray-700 mb-1'>name</label>
                            <input type="text"
                                placeholder='pratyaksh saini'
                                className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                {...register("name", {
                                    required: "name is required",
                                })}
                            />
                            {errors.email && <p className='text-red-500 text-sm'>{String(errors.email.message)}</p>}
                            <label className='block text-gray-700 mb-1'>Email</label>
                            <input type="email"
                                placeholder='sainipratyaksh28@gmail.com'
                                className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: "Invalid email address"
                                    }
                                })}
                            />
                            {errors.email && <p className='text-red-500 text-sm'>{String(errors.email.message)}</p>}
                            <label className='block text-gray-700 mb-1'>Password</label>
                            <div className='relative'>
                                <input
                                    type={passwordVisible ? "text" : "password"}
                                    placeholder='Min. 6 characters'
                                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                                    {...register("password", {
                                        required: "password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters long"
                                        }
                                    })}
                                />
                                <button type='button' onClick={() => { setPasswordVisible(!passwordVisible) }} className='absolute inset-y-0 right-3 flex items-center text-gray-400'>
                                    {passwordVisible ? <Eye /> : <EyeOff />}
                                </button>
                                {errors.password && <p className='text-red-500 text-sm'>{String(errors.password.message)}</p>}
                            </div>
                            <button type='submit'
                                disabled={signupMutation.isPending}
                                className='w-full text-lg mt-4 cursor-pointer bg-black text-white py-2 rounded-lg'
                            >
                                {signupMutation.isPending ? "Signing up..." : "Signup"}
                            </button>
                        </form>
                    ) : (
                        <div>
                            <h3 className='text-center mb-4 font-semibold text-xl'>Enter Otp</h3>
                            <div className='flex justify-center gap-6'>
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
                                        className='w-12 h-12 text-center border border-gray-300 outline-none !rounded'
                                        value={digit}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                    />
                                ))}
                            </div>
                            <button className='w-full mt-4 text-lg cursor-pointer bg-blue-500 text-white py-2 rounded-lg'
                                disabled={verifyOtpMutation.isPending}
                                onClick={() => verifyOtpMutation.mutate()}
                            >
                                {verifyOtpMutation.isPending ? "Verifing..." : "Verify OTP"}
                            </button>
                            <p className='text-center text-sm mt-4'>
                                {canResend ? (
                                    <button
                                        onClick={resendOtp}
                                        className='text-blue-500 cursor-pointer'
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    `Resend OTP in ${timer}`
                                )}
                            </p>
                            {
                                verifyOtpMutation.isError &&
                                verifyOtpMutation.error instanceof AxiosError && (
                                    <p className='text-red-500 text-sm mt-2'>
                                        {verifyOtpMutation.error.response?.data?.message ||
                                            verifyOtpMutation.error.message
                                        }
                                    </p>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Signup;

