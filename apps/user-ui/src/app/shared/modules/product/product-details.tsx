'use client'
import { ChevronLeft, ChevronRight, Heart, MapPin, MessageSquareText, Package, ShoppingCart, WalletMinimal } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import ReactImageMagnify from 'react-image-magnify';
import Ratings from '../../components/ratings/Ratings';
import Link from 'next/link';
import { useStore } from 'apps/user-ui/src/store';
import useUser from 'apps/user-ui/src/hooks/useUser';
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking';
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceInfo';
import ProductCard from '../../components/cards/ProductCard';
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';

const ProductDetails = ({ productDetails }: { productDetails: any }) => {

    const { user, isLoading } = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();

    const [currentImage, setCurrentImage] = useState(productDetails?.images?.[0]?.url);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSelected, setIsSelected] = useState(productDetails?.colors?.[0] || "");
    const [isSizeSelected, setIsSizeSelected] = useState(productDetails?.sizes?.[0] || "");
    const [quantity, setQuantity] = useState(1);
    const [priceRange, setPriceRange] = useState([
        productDetails?.sale_price, 1199
    ]);
    const [recommendedProducts, setRecommendedProducts] = useState([]);

    // Store actions
    const addToCart = useStore((state: any) => state.addToCart);
    const addToWishlist = useStore((state: any) => state.addToWishlist);
    const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
    const wishlist = useStore((state: any) => state.wishlist);
    const isWishlisted = wishlist.some((item: any) => item.id === productDetails.id);
    const cart = useStore((state: any) => state.cart);
    const isInCart = cart.some((item: any) => item.id === productDetails.id);

    const prevImage = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setCurrentImage(productDetails?.images[currentIndex - 1]);
        }
    }

    const nextImage = () => {
        if (currentIndex < productDetails?.images.length - 1) {
            setCurrentImage(productDetails?.images[currentIndex + 1]);
            setCurrentIndex(currentIndex + 1);
        }
    }

    const discountPercentage = Math.round(
        ((productDetails.regular_price - productDetails.sale_price) / productDetails.regular_price) * 100
    )

    const fetchFilteredProducts = async () => {
        try {
            const query = new URLSearchParams();

            query.set("priceRange", priceRange.join(","));
            query.set('page', '1');
            query.set('limit', '5');

            const res = await axiosInstance.get(
                `/product/api/get-filtered-products?${query.toString()}`
            );

            console.log(res);

            setRecommendedProducts(res.data.products);

        } catch (error) {
            console.error("Failed to fetch filtered products", error);
        }
    }

    useEffect(() => {
        fetchFilteredProducts();
    }, [priceRange]);

    return (
        <div className='w-full bg-[#f5f5f5] py-5'>
            <div className="w-[90%] bg-white lg:w-[80%] mx-auto pt-6 grid grid-cols-1 lg:grid-cols-[28%_44%_28%] gap-6 overflow-hidden">
                {/* Left column Product images */}
                <div className='p-4'>
                    <div className="relative w-full">
                        {/* Main image with Zoom */}
                        <ReactImageMagnify
                            {...{
                                smallImage: {
                                    alt: 'Product Image',
                                    isFluidWidth: true,
                                    src: currentImage || ""
                                },
                                largeImage: {
                                    src: currentImage || "",
                                    width: 1200,
                                    height: 1200,
                                },
                                enlargedImageContainerDimensions: {
                                    width: '150%',
                                    height: '150%',
                                },
                                enlargedImageStyle: {
                                    border: 'none',
                                    boxShadow: 'none'
                                },
                                enlargedImagePosition: 'right'
                            }}
                        />
                    </div>
                    {/* Thumbnail images array */}
                    <div className='relative flex items-center gap-2 mt-4 overflow-hidden'>
                        {productDetails?.images?.length > 4 && (
                            <button
                                className='left-0 absolute bg-white p-2 rounded-full shadow-md z-10'
                                onClick={prevImage}
                                disabled={currentIndex === 0}
                            >
                                <ChevronLeft size={24} />
                            </button>
                        )}
                        <div className="flex gap-2 overflow-x-auto">
                            {
                                productDetails?.images?.map((img: any, index: number) => (
                                    <Image
                                        key={index}
                                        src={img?.url || ""}
                                        alt='product Image'
                                        width={60}
                                        height={60}
                                        className={`cursor-pointer border rounded-lg p-1 ${currentImage === img ? 'border-blue-500' : 'border-gray-300'}`}
                                        onClick={() => {
                                            setCurrentImage(img);
                                            setCurrentIndex(index);
                                        }}
                                    />
                                ))}
                        </div>
                        {productDetails?.images.length > 4 && (
                            <button
                                className='right-0 absolute bg-white p-2 rounded-full shadow-md z-10'
                                onClick={nextImage}
                                disabled={currentIndex === productDetails?.images.length - 1}

                            >
                                <ChevronRight size={24} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Middle column - product details */}
                <div className='p-4'>
                    <h1 className='text-xl mb-2 font-medium'>
                        {productDetails?.title}
                    </h1>
                    <div className='w-full flex items-center justify-between'>
                        <div className='flex gap-2 mt-2 text-yellow-500'>
                            <Ratings rating={productDetails?.rating} />
                            <Link
                                href={"#reviews"}
                                className='text-blue-500 hover:underline'
                            >
                                (0 Reviews)
                            </Link>
                        </div>
                        <div>
                            <Heart size={25} fill={isWishlisted ? 'red' : 'transparent'}
                                className='cursor-pointer'
                                color={isWishlisted ? 'transparent' : '#777'}
                                onClick={isWishlisted ? removeFromWishlist(productDetails.id, user, location, deviceInfo) : (addToWishlist({
                                    ...productDetails, quantity, selectedOptions: {
                                        color: isSelected,
                                        size: isSizeSelected
                                    }
                                }))}
                            />
                        </div>
                    </div>
                    <div className='py-2 border-b border-gray-200'>
                        <span className='text-gray-500'>
                            Brand : {" "}
                            <span className='text-blue-500'>
                                {productDetails?.brand || "No Brand"}
                            </span>
                        </span>
                    </div>

                    <div className="mt-3">
                        <span className='text-3xl font-bold text-orange-500'>
                            ${productDetails?.sale_price}
                        </span>
                        <div className='flex gap-2 pb-2 text-lg border-b border-b-slate-200'>
                            <span className='text-gray-400 line-through'>
                                ${productDetails?.regular_price}
                            </span>
                            <span className='text-gray-500'>{discountPercentage}%</span>
                        </div>
                        <div className="mt-2">
                            <div className="flex flex-col md:flex-row items-start gap-5 mt-4">
                                {/* Color options */}
                                {productDetails?.colors?.length > 0 && (
                                    <div>
                                        <strong>Color :</strong>
                                        <div className='flex gap-2 mt-1'>
                                            {productDetails?.colors?.map((color: string, index: number) => (
                                                <button
                                                    key={index}
                                                    className={`w-8 h-8 cursor-pointer rounded-full border-2 transition ${isSelected === color ? "border-gray-400 scale-110 shadow-md" : "border-transparent"}`}
                                                    onClick={() => setIsSelected(color)}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Size options */}
                                {productDetails?.sizes?.length > 0 && (
                                    <div>
                                        <strong>Size :</strong>
                                        <div className='flex gap-2 mt-1'>
                                            {productDetails.sizes.map((size: string, index: number) => (
                                                <button
                                                    key={index}
                                                    className={`px-4 py-1 cursor-pointer rounded-md transition ${isSizeSelected === size ? 'bg-gray-800 text-white'
                                                        : 'bg-gray-200 text-black'}`}
                                                    onClick={() => setIsSizeSelected(size)}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='mt-6'>
                            <div className='flex items-center gap-3'>
                                <div className="flex items-center rounded-md">
                                    <button
                                        className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md'
                                        onClick={() => {
                                            setQuantity((prev) => Math.max(1, prev - 1))
                                        }}
                                    >
                                        -
                                    </button>
                                    <span className='px-4 bg-gray-100 py-1'>{quantity}</span>
                                    <button
                                        className='px-3 cursor-pointer py-1 bg-gray-300 hover:bg-gray-400 text-black font-semibold rounded-l-md'
                                        onClick={() => {
                                            setQuantity((prev) => prev + 1)
                                        }}
                                    >
                                        +
                                    </button>
                                </div>
                                {productDetails?.stock > 0 ? (
                                    <span className='text-green-600 font-semibold'>
                                        In stock{" "}
                                        <span className='text-gray-500 font-medium'>
                                            (Stock {productDetails?.stock})
                                        </span>
                                    </span>
                                ) : (
                                    <span className='text-red-600 font-semibold'>
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                            <button className={`flex mt-6 items-center gap-2 px-5 py-[10px] bg-[#ff5722] hover:bg-[#e64a19] text-white font-medium rounded-lg transition ${isInCart ? "cursor-not-allowed" : 'cursor-pointer'}`}
                                disabled={isInCart || productDetails?.stock === 0}
                                onClick={() => {
                                    addToCart({
                                        ...productDetails,
                                        quantity,
                                        selectedOptions: {
                                            color: isSelected,
                                            size: isSizeSelected,
                                        },
                                        user,
                                        location,
                                        deviceInfo
                                    })
                                }}
                            >
                                <ShoppingCart size={18} />
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* right column - seller information */}
                <div className='bg-[#fafafa] -mt-6'>
                    <div className='mb-1 p-3 border-b border-b-gray-100'>
                        <span className='text-sm text-gray-600'>
                            Delivery Options
                        </span>
                        <div className='flex items-center text-gray-600 gap-1'>
                            <MapPin size={18} className='ml-[-5px]' />
                            <span className='text-lg font-normal'>
                                {location?.city + " " + location?.country}
                            </span>
                        </div>
                    </div>
                    <div className='mb-1 px-3 pb-1 border-b border-b-gray-100'>
                        <span className='text-sm text-gray-600'>
                            Return & Warranty
                        </span>
                        <div className='flex items-center text-gray-600 gap-1'>
                            <Package size={18}
                                className='ml-[-5px]'
                            />
                            <span className='text-base font-normal'>7 Days Returns</span>
                        </div>
                        <div className='flex items-center py-2 text-gray-600 gap-1'>
                            <WalletMinimal size={18} className='ml-[-5px]' />
                            <span className='text-base font-normal'>Warranty not available</span>
                        </div>
                    </div>
                    <div className='px-3 py-1'>
                        <div className='w-[85%] rounded-lg'>
                            {/* Sold by section */}
                            <div className='flex items-center justify-between'>
                                <div>
                                    <span className='text-sm text-gray-600 font-light'>
                                        Sold by
                                    </span>
                                    <span className='block max-w[150px] truncate font-medium text-lg'>
                                        {productDetails?.Shop?.name}
                                    </span>
                                </div>
                                <Link
                                    href={"#"}
                                    className='text-blue-500 text-sm flex items-center gap-1'
                                >
                                    <MessageSquareText />
                                    Chat Now
                                </Link>
                            </div>
                            {/* Seller performance stats */}
                            <div className='grid grid-cols-3 gap-2 border-t border-t-gray-200 mt-3 pt-3'>
                                <div>
                                    <p className='text-[12px] text-gray-500'>
                                        Positive Seller Ratings
                                    </p>
                                    <p className='text-lg font-semibold'>
                                        88%
                                    </p>
                                </div>
                                <div>
                                    <p className='text-[12px] text-gray-500'>
                                        Ship on Time
                                    </p>
                                    <p className='text-lg font-semibold'>
                                        100%
                                    </p>
                                </div>
                                <div>
                                    <p className='text-[12px] text-gray-500'>
                                        Chat Response Time
                                    </p>
                                    <p className='text-lg font-semibold'>
                                        100%
                                    </p>
                                </div>
                            </div>
                            {/* Go to store */}
                            <div className='text-center mt-4 border-t border-t-gray-200 pt-2'>
                                <Link
                                    href={`/shop/${productDetails?.Shop.id}`}
                                    className='text-blue-500 font-medium text-sm hover:underline'
                                >
                                    GO TO STORE
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-[90%] lg:w-[80%] mx-auto mt-5'>
                <div className='bg-white min-h-[60vh] h-full p-5'>
                    <h3 className='text-lg font-semibold'>
                        Product Details of {productDetails?.title}
                    </h3>
                    <div
                        className='prose prose-sm text-slate-200 max-w-none'
                        dangerouslySetInnerHTML={{
                            __html: productDetails?.detailed_description,
                        }}
                    />
                </div>
            </div>
            <div className='w-[90%] lg:w-[80%] mx-auto mt-5'>
                <div className="bg-white min-h[50vh] h-full mt-5 p-5">
                    <h3 className='text-lg font-semibold'>
                        Ratings & Reviews of {productDetails?.title}
                    </h3>
                    <p className='text-center pt-14'>
                        No Reviews available yet !!
                    </p>
                </div>
            </div>
            <div className='w-[90%] lg:w-[80%] mx-auto mt-5'>
                <div className='w-full h-full my-5 p-5'>
                    <h3 className='text-xl font-semibold mb-2'>
                        You may also like
                    </h3>
                    <div
                        className='m-auto grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5'
                    >
                        {recommendedProducts.map((i: any) => (
                            <ProductCard
                                key={i.id}
                                product={i}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails