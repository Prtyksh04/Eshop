import { Pencil, WandSparkles, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'

const ImagePlaceHolder = ({
    size, small, onImageChange, onRemove, defaultImage = null, index = null, setOpenImageModal, setSelectedImage, images, pictureUploadingLoader
}: {
    size: string;
    small?: boolean;
    onImageChange: (file: File | null, index: number) => void;
    onRemove?: (index: number) => void;
    defaultImage?: string | null;
    setOpenImageModal: (openImageModal: boolean) => void;
    index?: any,
    setSelectedImage: (imageUrl: string, index: number) => void,
    images: any,
    pictureUploadingLoader: boolean

}) => {

    const [localPreview, setLocalPreview] = useState<string | null>(defaultImage)

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setLocalPreview(URL.createObjectURL(file));
            onImageChange(file, index!);
        }
    }

    const currentImageUrl = images?.[index!]?.file_url || localPreview;

    return (
        <div className={`relative ${small ? 'h-[180px]' : 'h-[480px]'} w-full cursor-pointer bg-[#1e1e1e] border border-gray-600 rounded-lg flex flex-col justify-center items-center`}>
            <input type="file"
                accept='image/*'
                className='hidden'
                id={`image-upload-${index}`}
                onChange={handleFileChange}
            />
            {currentImageUrl ? (
                <>
                    <button type='button'
                        disabled={pictureUploadingLoader}
                        onClick={() => onRemove?.(index!)}
                        className='top-3 absolute right-3 p-2 !rounded bg-red-600 shadow-lg'
                    >
                        <X size={16} />
                    </button>
                    <button
                        disabled={pictureUploadingLoader}
                        className='absolute top-3 right-[70px] p-2 !rounded bg-blue-500 shadow-lg cursor-pointer'
                        onClick={() => {
                            setOpenImageModal(true);
                            if (images?.[index!]?.file_url) {
                                setSelectedImage(images[index].file_url, index!);
                            }
                        }}
                    >
                        <WandSparkles size={16} />
                    </button>
                </>
            ) : (
                <label
                    htmlFor={`image-upload-${index}`}
                    className='absolute top-3 right-3 p-2 !rounded bg-slate-700 shadow-lg cursor-pointer'
                >
                    <Pencil size={16} />
                </label>
            )}
            {currentImageUrl ? (
                <Image
                    key={currentImageUrl}
                    src={currentImageUrl}
                    alt="uploaded"
                    width={400}
                    height={300}
                    className='w-full h-full object-cover rounded-lg'
                    unoptimized
                />
            ) : (
                <>
                    <p className={`text-gray-400 ${small ? "text-xl" : "text-4xl"} font-semibold`}>
                        {size}
                    </p>
                    <p className={`text-gray-500 ${small ? "text-sm" : "text-lg"} pt-2 text-center`}>
                        Please choose an image <br />
                        according to the expected ratio
                    </p>
                </>
            )}
        </div>
    )
}

export default ImagePlaceHolder
