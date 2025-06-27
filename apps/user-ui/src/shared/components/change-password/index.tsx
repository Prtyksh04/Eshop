import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

const ChangePassword = () => {

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const { register, handleSubmit, watch, reset, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    setError("");
    setMessage("");
    try {
      await axiosInstance.post("/api/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data?.confirmPassword,
      });
      setMessage("Password updated successfully!");
      reset();
    } catch (error: any) {
      setError(error?.response?.data?.message)
    }
  }

  return (
    <div className='max-w-md mx-auto space-y-6'>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <label className='block mb-1 text-sm font-medium text-gray-700'>
            Current Password
          </label>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword