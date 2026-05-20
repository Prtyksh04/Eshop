'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ChevronRight, Plus, Trash, X, Loader2 } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Input from '../../../../../../../packages/components/input';
import { AxiosError } from 'axios';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import DeleteDiscountCodeModal from 'apps/seller-ui/src/shared/components/modals/deleteDiscountCodeModal';



const page = () => {

    const [showModal, setShowModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedDiscount, setSelectedDiscount] = useState<any>();

    const queryClient = useQueryClient();

    const { data: discountCodes = [], isLoading } = useQuery({
        queryKey: ['shop-discounts'],
        queryFn: async () => {
            const res = await axiosInstance.get('/product/api/get-discount-codes');
            return res?.data?.discount_codes || [];
        }
    })

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            public_name: '',
            discountType: 'percentage',
            discountValue: '',
            discountCode: '',

        }
    });

    const createDiscountMutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosInstance.post('/product/api/create-discount-code', data);
            return res?.data?.discount_codes || [];
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
            setShowModal(false);
            reset();
            toast.success("Discount code created successfully");
        }
    })

    const deleteDiscountMutation = useMutation({
        mutationFn: async (discountId: string) => {
            await axiosInstance.delete(`/product/api/delete-discount-code/${discountId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-discounts'] });
            setShowDeleteModal(false);
            toast.success("Discount code deleted successfully");
        },
    });

    const handleDeleteClick = async (discount: any) => {
        setShowDeleteModal(true);
        setSelectedDiscount(discount);
    }



    const onSubmit = (data: any) => {
        if (discountCodes.length >= 8) {
            toast.error('You can only create up to 8 discount Codes');
            return;
        }

        createDiscountMutation.mutate(data);
    }

    return (
        <div className='w-full min-h-screen p-8 text-slate-800 bg-slate-50'>
            <div className='flex justify-between items-center mb-1'>
                <h2 className='text-2xl text-slate-800 font-bold'>
                    Discount Codes
                </h2>
                <button
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm transition'
                    onClick={() => setShowModal(true)}
                >
                    <Plus size={18} /> Create Discount
                </button>
            </div>
            {/*Breadcrumbs*/}
            <div className='flex items-center text-slate-500 mb-6 text-sm font-medium'>
                <Link href={'/dashboard'} className='text-blue-600 hover:underline cursor-pointer'>Dashboard</Link>
                <ChevronRight size={16} className='mx-1' />
                <span className='text-slate-600'>Discount Codes</span>
            </div>

            <div className='mt-8 bg-white border border-slate-200 p-6 rounded-xl shadow-sm'>
                <h3 className='text-lg font-bold text-slate-800 mb-4'>
                    Your Discount Codes
                </h3>
                {
                    isLoading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
                        </div>
                    ) : (
                        <table className='w-full text-slate-700 text-sm'>
                            <thead>
                                <tr className='border-b border-slate-100 bg-slate-50/50 text-slate-500 uppercase tracking-wider text-xs font-semibold'>
                                    <th className='p-3 text-left'>Title</th>
                                    <th className='p-3 text-left'>Type</th>
                                    <th className='p-3 text-left'>Value</th>
                                    <th className='p-3 text-left'>Code</th>
                                    <th className='p-3 text-left'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {discountCodes?.map((discount: any) => (
                                    <tr key={discount?.id} className='hover:bg-slate-50/70 transition'>
                                        <td className='p-3 font-medium text-slate-800'>{discount?.public_name}</td>
                                        <td className='p-3 capitalize text-slate-600'>
                                            {discount.discountType === "percentage"
                                                ? 'Percentage (%)'
                                                : "Flat (₹)"
                                            }
                                        </td>
                                        <td className='p-3 font-semibold text-slate-800'>
                                            {discount.discountType === "percentage"
                                                ? `${discount.discountValue}%`
                                                : `₹${discount.discountValue}`
                                            }
                                        </td>
                                        <td className='p-3 font-mono bg-slate-50 text-slate-700 px-2 py-1 rounded inline-block my-2 border border-slate-100'>{discount.discountCode}</td>
                                        <td className='p-3 align-middle'>
                                            <button
                                                onClick={() => handleDeleteClick(discount)}
                                                className='text-slate-600 hover:text-rose-600 transition'
                                                title="Delete Discount"
                                            >
                                                <Trash size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    )
                }
                {
                    !isLoading && discountCodes?.length === 0 && (
                        <p className='text-slate-500 font-medium w-full block pt-10 text-center'>
                            No Discount Codes Available
                        </p>
                    )
                }
            </div>

            {/* Create Discount Modal */}

            {
                showModal && (
                    <div className='fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300'>
                        <div className='bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-100 transform scale-100 transition-all'>
                            <div className='flex justify-between items-center border-b border-slate-100 pb-3.5'>
                                <h3 className='text-lg font-bold text-slate-800'>Create Discount Code</h3>
                                <button onClick={() => setShowModal(false)}
                                    className='text-slate-400 hover:text-slate-600 transition'
                                >
                                    <X size={22} />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit(onSubmit)} className='mt-4 space-y-4'>
                                {/* Title */}
                                <div>
                                    <Input
                                        label='Title (Public Name)'
                                        className="w-full"
                                        {...register("public_name", { required: "Title is Required" })}
                                    />
                                    {
                                        errors.public_name && (
                                            <p className='text-rose-600 text-xs mt-1 font-medium'>
                                                {errors.public_name.message}
                                            </p>
                                        )
                                    }
                                </div>
                                
                                <div>
                                    <label
                                        className='block text-sm font-semibold text-slate-700 mb-1.5'
                                    >
                                        Discount Type
                                    </label>
                                    <Controller
                                        control={control}
                                        name="discountType"
                                        render={({ field }) => (
                                            <select
                                                className="w-full border border-slate-200 outline-none bg-white text-slate-800 rounded-lg px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm"
                                                {...field}
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="flat">Flat (₹)</option>
                                            </select>
                                        )}
                                    />
                                </div>

                                <div>
                                    <Input
                                        label='Discount Value'
                                        type='number'
                                        min={1}
                                        className="w-full"
                                        {...register('discountValue', {
                                            required: "Value is Required"
                                        })}
                                    />
                                    {
                                        errors.discountValue && (
                                            <p className='text-rose-600 text-xs mt-1 font-medium'>
                                                {errors.discountValue.message}
                                            </p>
                                        )
                                    }
                                </div>

                                <div>
                                    <Input
                                        label='Discount Code'
                                        className="w-full font-mono uppercase"
                                        {...register("discountCode", {
                                            required: "Discount Code is Required"
                                        })}
                                    />
                                    {
                                        errors.discountCode && (
                                            <p className='text-rose-600 text-xs mt-1 font-medium'>
                                                {errors.discountCode.message}
                                            </p>
                                        )
                                    }
                                </div>

                                <button
                                    type='submit'
                                    disabled={createDiscountMutation.isPending}
                                    className='mt-2 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-sm transition'
                                >
                                    <Plus size={18} /> {createDiscountMutation.isPending ? 'Creating ... ' : 'Create'}
                                </button>
                                {createDiscountMutation.isError && (
                                    <p className='text-rose-600 text-sm mt-2 font-medium'>
                                        {
                                            (
                                                createDiscountMutation.error as AxiosError<{ message: string }>
                                            )?.response?.data?.message || "Something went wrong"
                                        }
                                    </p>
                                )}
                            </form>
                        </div>
                    </div>
                )
            }
            {
                showDeleteModal && selectedDiscount && (
                    <DeleteDiscountCodeModal
                        discount={selectedDiscount}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => deleteDiscountMutation.mutate(selectedDiscount?.id)}
                    />
                )
            }

        </div>
    )
}

export default page