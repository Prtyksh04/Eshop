'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Input from 'packages/components/input';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';

type FormData = {
  email: string,
  password: string
}

const page = () => {

  const { register, handleSubmit } = useForm<FormData>();
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/login-admin`, data, { withCredentials: true });
      return response.data;
    },
    onSuccess: (data) => {
      setServerError(null);
      router.push('/dashboard');
    },
    onError: (error: AxiosError) => {
      const errorMessage =
        (error.response?.data as { message?: string })?.message || "Invalid Credentials";
      setServerError(errorMessage);
    }
  })

  const onSubmit = async (data: FormData) => {
    loginMutation.mutate(data);
  }


  return (
    <div className='w-full h-screen flex items-center justify-center bg-slate-50'>
      <div className='md:w-[450px] pb-8 bg-white rounded-xl shadow-lg border border-slate-100'>
        <form className='p-8' method="POST" onSubmit={handleSubmit(onSubmit)}>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-slate-900'>
              Welcome Admin
            </h1>
            <p className='text-slate-500 mt-2'>Sign in to your Vendora dashboard</p>
          </div>
          <div className='space-y-4'>
            <Input
              label='Email'
              placeholder='admin@vendora.com'
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                  message: 'Invalid email address'
                }
              })}
            />

            <div>
              <Input
                label='Password'
                type='password'
                placeholder='••••••••'
                {...register("password", {
                  required: 'Password is required',
                })}
              />
            </div>
          </div>
          <button
            disabled={loginMutation.isPending}
            className='w-full mt-6 text-lg flex justify-center font-semibold cursor-pointer bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors'
            type='submit'
          >
            {loginMutation.isPending ? (
              <div className='h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin' />
            ) : (
              <>Sign In</>
            )}
          </button>
          {serverError && (
            <div className='text-red-500 text-sm mt-4 text-center bg-red-50 p-3 rounded-lg'>
              {serverError}
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default page