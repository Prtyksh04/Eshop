'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

type FormData = {
    email: string;
    password: string;
}

const Login = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [remeberMe, setRememberMe] = useState(false);
    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

    const loginMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-seller`, data , {
                withCredentials: true
            });
            return response.data;
        },
        onSuccess: (data) => {
            setServerError(null);
            router.push("/");
        },
        onError: (error: AxiosError) => {
            const errorMessage = (error.response?.data as { message?: string })?.message || "Invalid Credentials!";
            setServerError(errorMessage)
        }
    })

    const onSubmit = (data: FormData) => {
        loginMutation.mutate(data);
    }


    return (
        <div className='w-full py-10 min-h-screen bg-slate-50 flex flex-col items-center justify-center'>
            <div className='text-center mb-8'>
                <h1 className='text-4xl font-bold text-slate-900'>
                    Vendora Seller Portal
                </h1>
                <p className='text-lg text-slate-500 mt-2'>
                    Manage your store and grow your business
                </p>
            </div>
            <div className='w-full flex justify-center px-4'>
                <div className='w-full max-w-md p-8 bg-white shadow-lg border border-slate-100 rounded-xl'>
                    <h3 className='text-2xl font-semibold text-center text-slate-900 mb-2'>
                        Welcome Back
                    </h3>
                    <p className='text-center text-slate-500 mb-6'>
                        Don't have an account?{' '}
                        <Link href={'/signup'} className='text-blue-600 font-medium hover:underline'>
                            Sign up
                        </Link>
                    </p>
                    <div className='flex items-center justify-center my-6 text-slate-400 text-sm'>
                        <div className='flex-1 border-t border-slate-200' />
                        <span className='px-4 font-medium'>Sign in with Email</span>
                        <div className='flex-1 border-t border-slate-200' />
                    </div>
                    <form method="POST" onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-slate-700 mb-1'>Email</label>
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
                                            message: "Password must be at least 6 characters long"
                                        }
                                    })}
                                />
                                <button type='button' onClick={() => { setPasswordVisible(!passwordVisible) }} className='absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors'>
                                    {passwordVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                                </button>
                            </div>
                            {errors.password && <p className='text-red-500 text-sm mt-1'>{String(errors.password.message)}</p>}
                        </div>
                        <div className='flex items-center justify-between pt-2 pb-4'>
                            <label className='flex items-center text-sm text-slate-600 cursor-pointer'>
                                <input
                                    type="checkbox"
                                    className='mr-2 w-4 h-4 text-blue-600 bg-slate-50 border-slate-300 rounded focus:ring-blue-500'
                                    checked={remeberMe}
                                    onChange={() => setRememberMe(!remeberMe)}
                                />
                                Remember me
                            </label>
                            <Link href={'/forgot-password'} className='text-sm text-blue-600 font-medium hover:underline'>
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type='submit'
                            disabled={loginMutation.isPending}
                            className='w-full text-lg font-semibold bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors flex justify-center items-center'
                        >
                            {loginMutation.isPending ? (
                                <div className='h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
                            ) : "Sign In"}
                        </button>
                        {serverError && (
                            <div className='text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg'>
                                {serverError}
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;