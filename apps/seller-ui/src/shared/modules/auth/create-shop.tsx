import { useMutation } from '@tanstack/react-query';
import { shopCategories } from 'apps/seller-ui/src/utils/categories';
import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';

const CreateShop = ({
    sellerId,
    setActiveStep
}: {
    sellerId: string,
    setActiveStep: (step: number) => void;
}) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const shopCreateMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URI}/api/create-shop`, data);

            return response.data;
        },
        onSuccess: () => {
            setActiveStep(3);
        }
    });

    const onSubmit = async (data: any) => {
        const shopData = { ...data, sellerId };

        shopCreateMutation.mutate(shopData);
    }

    const countWords = (text: string) => text.trim().split(/\s+/).length;

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <h3 className='text-2xl font-semibold text-center mb-4'>
                    Setup new shop
                </h3>

                <label className='block text-gray-700 mb-1'>Name *</label>
                <input type="text"
                    placeholder='shop name'
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                    {...register("name", {
                        required: "name is required",
                    })}
                />
                {errors.name && <p className='text-red-500 text-sm'>{String(errors.name.message)}</p>}
                <label className='block text-gray-700 mb-1'>Bio (Max 100 words) *</label>
                <input type="text"
                    placeholder='shop bio'
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                    {...register("bio", {
                        required: "bio is required",
                        validate: (value) =>
                            countWords(value) <= 100 || "Bio can't exeed"
                    })}
                />
                {errors.bio && <p className='text-red-500 text-sm'>{String(errors.bio.message)}</p>}

                <label className='block text-gray-700 mb-1'>Address *</label>
                <input type="text"
                    placeholder='shop location'
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                    {...register("address", {
                        required: "Shop Address is required",
                    })}
                />
                {errors.address && <p className='text-red-500 text-sm'>{String(errors.address.message)}</p>}

                <label className='block text-gray-700 mb-1'>Opening Hours *</label>
                <input type="text"
                    placeholder='e.g., Mon-Fri 9Am - 6Pm'
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px] mb-1'
                    {...register("opening_hours", {
                        required: "Opening hours is required",
                    })}
                />
                {errors.opening_hours && <p className='text-red-500 text-sm'>{String(errors.opening_hours.message)}</p>}

                <label className='block text-gray-700 mb-1'>Website</label>
                <input
                    type="url"
                    placeholder='https://example.com'
                    className='w-full p-2 border border-gray-300 outline-0 !rounded mb-1'
                    {...register("website", {
                        pattern: {
                            value: /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/,
                            message: "Enter a valid URL"
                        },
                    })}
                />
                {errors.website && (
                    <p className='text-red-500 text-sm'>{String(errors.website.message)}</p>
                )}
                <label className='block text-gray-700 mb-1'>Category *</label>
                <select
                    className='w-full p-2 border border-gray-300 outline-0 rounded-[4px]'
                    {...register("category", { required: "Category is required" })}
                >
                    <option value="">Select a Category</option>
                    {shopCategories.map((Category) => (
                        <option key={Category.value} value={Category.value}>
                            {Category.label}
                        </option>
                    ))}
                </select>
                {errors.category && (
                    <p className='text-red-500 text-sm'>{String(errors.category.message)}</p>
                )}
                <button
                    type={'submit'}
                    className='w-full text-lg bg-blue-600 text-white py-2 rounded-lg mt-4'
                >
                    Create
                </button>
            </form>
        </div>
    )
}

export default CreateShop