'use client'
import { useQuery } from '@tanstack/react-query';
import ImagePlaceHolder from 'apps/seller-ui/src/shared/components/image-placeholder';
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance';
import { ChevronRight, Wand } from 'lucide-react';
import ColorSelector from 'packages/components/color-selector';
import CustomProperties from 'packages/components/custom-properties';
import CustomSpecifications from 'packages/components/custom-specifications';
import Input from 'packages/components/input';
import dynamic from 'next/dynamic';
const RichTextEditor = dynamic(() => import('packages/components/RichTextEditor'), { ssr: false });
import SizeSelector from 'packages/components/size-selector';
import React, { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { X } from 'lucide-react';
import Image from 'next/image';
import { enhancements } from 'apps/seller-ui/src/utils/AI.Enhancements';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface UploadedImage {
    fileId: string;
    file_url: string;
}

const page = () => {

    const router = useRouter();

    const [OpenImageModal, setOpenImageModal] = useState(false);
    const isChanged = true;
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState<(UploadedImage | null)[]>([null])
    const [selectedImage, setSelectedImage] = useState('');
    const [selectedImageSource, setSelectedImageSource] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [pictureUploadingLoader, setpictureUploadingLoader] = useState(false);
    const [activeEffect, setActiveEffect] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const { register, control, watch, setValue, handleSubmit, formState: { errors } } = useForm();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            try {
                const res = await axiosInstance.get('/product/api/get-categories');
                return res.data;
            } catch (error) {
                console.log(error);
            }
        },
        staleTime: 1000 * 60 * 5,
        retry: 2,
    })

    const { data: discountCodes = [], isLoading: discountLoading } = useQuery({
        queryKey: ['shop-discounts'],
        queryFn: async () => {
            const res = await axiosInstance.get('/product/api/get-discount-codes');
            return res?.data?.discount_codes || [];
        }
    })

    const categories = data?.categories || [];
    const subCategoriesData = data?.subCategories || {};


    const selectedCategory = watch('category');
    const regularPrice = watch('regular_price');

    const subCategories = useMemo(() => {
        return selectedCategory ? subCategoriesData[selectedCategory] || [] : [];
    }, [selectedCategory, subCategoriesData])




    const onSubmit = async (data: any) => {
        try {
            setLoading(true);
            await axiosInstance.post('/product/api/create-product', data);
            router.push("/dashboard/all-products");
        } catch (error: any) {
            toast.error(error?.data?.message);
        } finally {
            setLoading(false);
        }

    }

    const convertFileToBase64 = (file: File) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    }

    const handleImageChange = async (file: File | null, index: number) => {
        if (!file) return;
        setpictureUploadingLoader(true);

        try {
            const fileName = await convertFileToBase64(file);
            const response = await axiosInstance.post('/product/api/upload-product-image', { fileName })
            const uploadedImage: UploadedImage = {
                fileId: response.data.fileId,
                file_url: response.data.file_url,
            }
            const updatedImages = [...images];
            updatedImages[index] = uploadedImage;

            if (index === images.length - 1 && updatedImages.length < 8) {
                updatedImages.push(null);
            }

            setImages(updatedImages);
            setValue('images', updatedImages);
        } catch (error) {
            console.error(error);
        } finally {
            setpictureUploadingLoader(false);
        }
    }



    const handleRemoveImage = async (index: number) => {

        try {
            const updatedImages = [...images];

            const ImageToDelete = updatedImages[index];
            if (ImageToDelete && typeof ImageToDelete === 'object') {
                await axiosInstance.delete('/product/api/delete-product-image', {
                    data: { fileId: ImageToDelete.fileId }
                })
            }

            updatedImages.splice(index, 1);

            //    Add null placeholder
            if (!updatedImages.includes(null) && updatedImages.length < 8) {
                updatedImages.push(null);
            }

            setImages(updatedImages);
            setValue('images', updatedImages);

        } catch (error) {
            console.log(error);
        }
    }

    const applyTransformation = async (transformation: string) => {
        if (!selectedImageSource || processing) return;
        setProcessing(true);
        setActiveEffect(transformation);
        try {
            const transformedUrlObject = new URL(selectedImageSource);
            transformedUrlObject.searchParams.set("tr", transformation);
            const transformedUrl = transformedUrlObject.toString();
            console.log("transformedUrl", transformedUrl);
            setSelectedImage(transformedUrl);
            if (selectedImageIndex !== null) {
                const updatedImages = [...images];
                const current = updatedImages[selectedImageIndex];
                if (current) {
                    updatedImages[selectedImageIndex] = {
                        ...current,
                        file_url: transformedUrl,
                    };
                    setImages(updatedImages);
                    setValue('images', updatedImages);
                }
            }

        } catch (error) {
            console.log(error);
        } finally {
            setProcessing(false);
        }
    }


    const handleSaveDraft = () => {

    }

    const closeImageEnhancerModal = () => {
        if (selectedImage && selectedImageIndex !== null) {
            const updatedImages = [...images];
            const current = updatedImages[selectedImageIndex];
            if (current) {
                updatedImages[selectedImageIndex] = {
                    ...current,
                    file_url: selectedImage,
                };
                setImages(updatedImages);
                setValue('images', updatedImages);
            }
        }

        setOpenImageModal(false);
        setActiveEffect(null);
        setSelectedImageSource('');
        setSelectedImageIndex(null);
    }

    return (
        <div className='w-full min-h-screen p-8 text-slate-800 bg-slate-50'>
            <form className='w-full mx-auto p-8 bg-white border border-slate-200 shadow-sm rounded-xl text-slate-800'
                onSubmit={handleSubmit(onSubmit)}
            >
                {/* Heading & Breadcrumbs */}
                <h2 className='text-2xl font-bold text-slate-800 mb-1.5'>
                    Create Product
                </h2>
                <div className='flex items-center text-slate-500 mb-6 text-sm font-medium'>
                    <Link href={'/dashboard'} className='text-blue-600 hover:underline cursor-pointer'>Dashboard</Link>
                    <ChevronRight size={16} className='mx-1' />
                    <span className='text-slate-600'>Create Product</span>
                </div>

                {/* Content layout */}
                <div className="py-2 w-full flex flex-col md:flex-row gap-8">
                    {/* Left side-Image upload section */}
                    <div className="w-full md:w-[35%]">
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Product Images *
                        </label>
                        {images.length > 0 && (
                            <ImagePlaceHolder
                                setOpenImageModal={setOpenImageModal}
                                size='765 x 850'
                                small={false}
                                images={images}
                                index={0}
                                pictureUploadingLoader={pictureUploadingLoader}
                                onImageChange={handleImageChange}
                                setSelectedImage={(imageUrl, imageIndex) => {
                                    setSelectedImage(imageUrl);
                                    setSelectedImageSource(imageUrl);
                                    setSelectedImageIndex(imageIndex);
                                    setActiveEffect(null);
                                }}
                                onRemove={handleRemoveImage}
                            />
                        )}

                        <div className='grid grid-cols-2 gap-3 mt-4'>
                            {images.slice(1).map((_, index) => (
                                <ImagePlaceHolder
                                    setOpenImageModal={setOpenImageModal}
                                    size='765 x 850'
                                    key={index}
                                    pictureUploadingLoader={pictureUploadingLoader}
                                    small={true}
                                images={images}
                                index={index + 1}
                                onImageChange={handleImageChange}
                                setSelectedImage={(imageUrl, imageIndex) => {
                                    setSelectedImage(imageUrl);
                                    setSelectedImageSource(imageUrl);
                                    setSelectedImageIndex(imageIndex);
                                    setActiveEffect(null);
                                }}
                                onRemove={handleRemoveImage}
                            />
                        ))}
                        </div>
                    </div>

                    {/* Right side - form inputs */}
                    <div className="w-full md:w-[65%]">
                        <div className="w-full flex flex-col md:flex-row gap-6">
                            {/* Product title input */}
                            <div className='w-full md:w-1/2 space-y-4'>
                                <div>
                                    <Input
                                        label='Product Title *'
                                        placeholder='Enter product title'
                                        className="w-full"
                                        {...register('title', { required: 'Product title is required' })}
                                    />
                                    {errors.title && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.title.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        type='textarea'
                                        rows={6}
                                        label='Short Description * (Max 150 words)'
                                        placeholder='Enter short description for quick view'
                                        className="w-full"
                                        {...register('short_description', {
                                            required: 'Description is required',
                                            validate: (value) => {
                                                const wordCount = value.trim().split(/\s+/).length;
                                                return wordCount <= 150 ||
                                                    `Description must be less than 150 words (Current: ${wordCount} words)`;
                                            }
                                        })}
                                    />
                                    {errors.short_description && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.short_description.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Tags *'
                                        placeholder='Apple, flagship, smartphone'
                                        className="w-full"
                                        {...register('tags', { required: 'Separate related tags with commas.' })}
                                    />
                                    {errors.tags && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.tags.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Warranty *'
                                        placeholder='1 Year / No Warranty'
                                        className="w-full"
                                        {...register('warranty', { required: 'Warranty information is required' })}
                                    />
                                    {errors.warranty && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.warranty.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Slug *'
                                        placeholder='product-slug-url'
                                        className="w-full font-mono"
                                        {...register('slug', {
                                            required: 'Slug is required',
                                            pattern: {
                                                value: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
                                                message: 'Invalid Slug format! Use only lowercase letters, numbers, and hyphens.'
                                            },
                                            minLength: {
                                                value: 3,
                                                message: 'Slug must be at least 3 characters long'
                                            },
                                            maxLength: {
                                                value: 50,
                                                message: 'Slug must be less than 50 characters long'
                                            }
                                        })}
                                    />
                                    {errors.slug && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.slug.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Brand'
                                        placeholder='Apple'
                                        className="w-full"
                                        {...register('brand')}
                                    />
                                    {errors.brand && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.brand.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <ColorSelector
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                <div>
                                    <CustomSpecifications
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                <div>
                                    <CustomProperties
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                        Cash On Delivery *
                                    </label>
                                    <select
                                        {...register('cash_on_delivery', { required: 'Cash on delivery option is required' })}
                                        defaultValue='yes'
                                        className='w-full border border-slate-200 outline-none bg-white rounded-lg p-2.5 text-slate-800 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm'
                                    >
                                        <option value='yes' className='bg-white text-slate-800'>
                                            Yes
                                        </option>
                                        <option value='no' className='bg-white text-slate-800'>
                                            No
                                        </option>
                                    </select>
                                    {errors.cash_on_delivery && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.cash_on_delivery.message as string}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="w-full md:w-1/2 space-y-4">
                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                        Category *
                                    </label>
                                    {
                                        isLoading ? (
                                            <p className='text-slate-400 text-sm'>Loading categories...</p>
                                        ) : (
                                            isError ? (
                                                <p className='text-rose-600 text-sm font-medium'>
                                                    Failed to load categories.
                                                </p>
                                            ) : (
                                                <Controller
                                                    name='category'
                                                    control={control}
                                                    rules={{ required: 'Category is required' }}
                                                    render={({ field }) => (
                                                        <select
                                                            {...field}
                                                            className='w-full border border-slate-200 outline-none bg-white rounded-lg p-2.5 text-slate-800 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm'
                                                        >
                                                            <option value='' className='bg-white text-slate-800'>
                                                                Select Category
                                                            </option>
                                                            {categories.map((category: string) => (
                                                                <option
                                                                    key={category}
                                                                    value={category}
                                                                    className='bg-white text-slate-800'
                                                                >
                                                                    {category}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    )}
                                                />
                                            )
                                        )
                                    }
                                    {errors.category && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.category.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                        Subcategory *
                                    </label>
                                    <Controller
                                        name='SubCategory'
                                        control={control}
                                        rules={{ required: 'Subcategory is required' }}
                                        render={({ field }) => (
                                            <select
                                                {...field}
                                                className='w-full border border-slate-200 outline-none bg-white rounded-lg p-2.5 text-slate-800 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-sm'
                                            >
                                                <option value='' className='bg-white text-slate-800'>
                                                    Select Subcategory
                                                </option>
                                                {subCategories?.map((subcategory: string) => (
                                                    <option
                                                        key={subcategory}
                                                        value={subcategory}
                                                        className='bg-white text-slate-800'
                                                    >
                                                        {subcategory}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    />
                                    {
                                        errors.SubCategory && (
                                            <p className='text-rose-600 text-xs mt-1 font-medium'>
                                                {errors.SubCategory.message as string}
                                            </p>
                                        )
                                    }
                                </div>

                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                        Detailed Description * (Min 100 words)
                                    </label>
                                    <div className="text-slate-800 border border-slate-200 rounded-lg overflow-hidden">
                                        <Controller
                                            name='detailed_description'
                                            control={control}
                                            rules={{
                                                required: 'Detailed description is required',
                                                validate: (value) => {
                                                    const wordCount = value.trim().split(/\s+/).length;
                                                    return wordCount >= 100 ||
                                                        `Description must be at least 100 words (Current: ${wordCount} words)`;
                                                }
                                            }}
                                            render={({ field }) => (
                                                <RichTextEditor
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                    {errors.detailed_description && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.detailed_description.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Video URL'
                                        placeholder='https://example.com/video-or-any-link'
                                        className="w-full"
                                        {...register('video_url', {
                                            validate: (value) => {
                                                if (!value || !value.trim()) return true;
                                                try {
                                                    const parsedUrl = new URL(value);
                                                    return ['http:', 'https:'].includes(parsedUrl.protocol) ||
                                                        'Please enter a valid URL (http or https)';
                                                } catch {
                                                    return 'Please enter a valid URL (http or https)';
                                                }
                                            },
                                        })}
                                    />
                                    {errors.video_url && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.video_url.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Regular Price (₹)'
                                        placeholder='20'
                                        className="w-full font-semibold"
                                        {...register('regular_price', {
                                            valueAsNumber: true,
                                            min: { value: 1, message: "Price must be at least 1" },
                                            validate: (value) =>
                                                !isNaN(value) || "Only numbers are allowed",
                                        })}
                                    />
                                    {errors.regular_price && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.regular_price.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Sale Price * (₹)'
                                        placeholder='15'
                                        className="w-full font-semibold text-emerald-600"
                                        {...register('sale_price', {
                                            valueAsNumber: true,
                                            min: { value: 1, message: "Price must be at least 1" },
                                            validate: (value) => {
                                                if (isNaN(value)) return "Only numbers are allowed";
                                                if (regularPrice && value >= regularPrice) {
                                                    return "Sale price must be less than regular price";
                                                }
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.sale_price && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.sale_price.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Input
                                        label='Stock *'
                                        placeholder='100'
                                        className="w-full font-semibold"
                                        {...register('stock', {
                                            valueAsNumber: true,
                                            required: 'Stock is required',
                                            min: { value: 1, message: "Stock must be at least 1" },
                                            max: {
                                                value: 1000,
                                                message: "Stock cannot exceed 1000"
                                            },
                                            validate: (value) => {
                                                if (isNaN(value)) return "Only numbers are allowed";
                                                if (!Number.isInteger(value))
                                                    return "Stock must be a whole number!";
                                                return true;
                                            }
                                        })}
                                    />
                                    {errors.stock && (
                                        <p className='text-rose-600 text-xs mt-1 font-medium'>
                                            {errors.stock.message as string}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <SizeSelector
                                        control={control}
                                        errors={errors}
                                    />
                                </div>

                                <div>
                                    <label className='block text-sm font-semibold text-slate-700 mb-1.5'>
                                        Select Discount Codes (Optional)
                                    </label>
                                    {
                                        discountLoading ? (
                                            <p className='text-slate-400 text-sm'>Loading discount codes...</p>
                                        ) : (
                                            <div className='flex flex-wrap gap-2'>
                                                {discountCodes?.map((code: any) => (
                                                    <button key={code.id}
                                                        type='button'
                                                        className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${
                                                            watch("discountCodes")?.includes(code.id) 
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                                                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                        onClick={() => {
                                                            const currentSelection = watch("discountCodes") || [];
                                                            const updatedSelection = currentSelection?.includes(code.id) 
                                                                ? currentSelection.filter((id: string) => id !== code.id) 
                                                                : [...currentSelection, code.id];
                                                            setValue("discountCodes", updatedSelection);
                                                        }}
                                                    >
                                                        {code?.public_name} ({code.discountValue}
                                                        {code.discountType === 'percentage' ? '%' : '₹'})
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Enhancer Modal */}
                {OpenImageModal && (
                    <div className='fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all duration-300'>
                        <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl border border-slate-100 transform scale-100 transition-all text-slate-800">
                            <div className='flex justify-between items-center pb-3 mb-4 border-b border-slate-100'>
                                <h2 className='text-lg font-bold text-slate-800'>
                                    Enhance Product Image
                                </h2>
                                <X
                                    size={20}
                                    className='cursor-pointer text-slate-400 hover:text-slate-600 transition'
                                    onClick={closeImageEnhancerModal}
                                />
                            </div>
                            <div className='relative w-full h-[250px] rounded-lg overflow-hidden border border-slate-200 shadow-inner bg-slate-50'>
                                <Image
                                    src={selectedImage}
                                    alt="product-Image"
                                    layout='fill'
                                    objectFit='cover'
                                    unoptimized
                                />
                            </div>
                            {selectedImage && (
                                <div className='mt-4 space-y-2.5'>
                                    <h3 className="text-slate-800 text-sm font-semibold">
                                        AI Enhancements
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto pr-1">
                                        {enhancements?.map(({ label, effect }) => (
                                            <button
                                                key={effect}
                                                type='button'
                                                className={`p-2 rounded-lg flex items-center justify-center gap-1.5 text-xs font-semibold border transition ${
                                                    activeEffect === effect 
                                                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                                onClick={() => applyTransformation(effect)}
                                                disabled={processing}
                                            >
                                                <Wand size={14} />
                                                <span>{label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className='mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6'>
                    {isChanged && (
                        <button
                            type='button'
                            className='px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition'
                            onClick={handleSaveDraft}
                        >
                            Save Draft
                        </button>
                    )}
                    <button
                        type='submit'
                        className='px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition'
                        disabled={loading}
                    >
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default page
