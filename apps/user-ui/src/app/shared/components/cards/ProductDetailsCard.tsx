import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import Ratings from '../ratings/Ratings'
import { HeartIcon, MapPin, ShoppingCart, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useStore } from 'apps/user-ui/src/store'
import useUser from 'apps/user-ui/src/hooks/useUser'
import useLocationTracking from 'apps/user-ui/src/hooks/useLocationTracking'
import useDeviceTracking from 'apps/user-ui/src/hooks/useDeviceInfo'

const ProductDetailsCard = ({
    data,
    setOpen
}: {
    data: any
    setOpen: (open: boolean) => void
}) => {
    const [activeImage, setActiveImage] = useState(0)
    const [isSelected, setIsSelected] = useState(data?.colors?.[0] || "")
    const [isSizeSelected, setIsSizeSelected] = useState(data?.sizes?.[0] || "")
    const [quantity, setQuantity] = useState(1)

    const router = useRouter();

    const { user } = useUser();
    const location = useLocationTracking();
    const deviceInfo = useDeviceTracking();


    // Store actions
    const addToCart = useStore((state: any) => state.addToCart);
    const addToWishlist = useStore((state: any) => state.addToWishlist);
    const removeFromWishlist = useStore((state: any) => state.removeFromWishlist);
    const wishlist = useStore((state: any) => state.wishlist);
    const isWishlisted = wishlist.some((item: any) => item.id === data.id);
    const cart = useStore((state: any) => state.cart);
    const isInCart = cart.some((item: any) => item.id === data.id);

    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    return (
        <div
            className="fixed inset-0 z-50 bg-black bg-opacity-20 flex items-center justify-center"
            onClick={() => setOpen(false)}
        >
            <div
                className="w-[95%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg p-6 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    className="absolute top-3 right-3 z-50 text-gray-700 hover:text-black bg-white rounded-full shadow-md p-1"
                    onClick={() => setOpen(false)}
                >
                    <X size={20} />
                </button>

                {/* Main Content */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Left Image Section */}
                    <div className="md:w-1/2">
                        <Image
                            src={data?.images?.[activeImage]?.url}
                            alt={data?.title}
                            width={500}
                            height={500}
                            className="rounded-lg object-contain w-full max-h-[400px]"
                        />

                        {/* Thumbnail Images */}
                        <div className="flex gap-2 mt-4 overflow-x-auto">
                            {data?.images?.map((img: any, index: number) => (
                                <div
                                    key={index}
                                    className={`cursor-pointer border rounded-md p-[2px] ${activeImage === index
                                        ? 'border-gray-500'
                                        : 'border-transparent'
                                        }`}
                                    onClick={() => setActiveImage(index)}
                                >
                                    <Image
                                        src={img?.url}
                                        alt={`Thumbnail ${index}`}
                                        width={80}
                                        height={80}
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Info Section */}
                    <div className="md:w-1/2 flex flex-col justify-between">
                        {/* Shop Info */}
                        <div className="flex gap-4 items-start border-b pb-4">
                            <Image
                                src={data?.Shop?.avatar}
                                alt="Shop"
                                width={50}
                                height={50}
                                className="rounded-full w-[50px] h-[50px] object-cover"
                            />
                            <div className="flex-1">
                                <Link
                                    href={`/shop/${data?.Shop?.id}`}
                                    className="text-lg font-semibold hover:underline"
                                >
                                    {data?.Shop?.name}
                                </Link>
                                <Ratings rating={data?.Shop?.ratings} />
                                <p className="text-sm text-gray-600 flex items-center mt-1">
                                    <MapPin size={16} className="mr-1" />
                                    {data?.Shop?.address || 'Location Not Available'}
                                </p>
                            </div>
                            <button
                                onClick={() => router.push(`/inbox?shopId=${data?.Shop?.id}`)}
                                className="bg-blue-600 text-white text-sm font-medium px-4 py-1.5 rounded hover:bg-blue-700 transition"
                            >
                                Chat with Seller
                            </button>
                        </div>

                        {/* Product Title & Description */}
                        <div className="mt-4">
                            <h2 className="text-xl font-bold">{data?.title}</h2>
                            <p className="text-gray-700 mt-2 whitespace-pre-wrap">
                                {data?.short_description}
                            </p>
                            {data?.brand && (
                                <p className="mt-2">
                                    <strong>Brand:</strong> {data.brand}
                                </p>
                            )}
                        </div>

                        {/* Color & Size Selectors */}
                        <div className="mt-4 flex flex-wrap gap-6">
                            {data?.colors?.length > 0 && (
                                <div>
                                    <strong>Color:</strong>
                                    <div className="flex gap-2 mt-2">
                                        {data.colors.map((color: string, index: number) => (
                                            <button
                                                key={index}
                                                className={`w-8 h-8 rounded-full border-2 ${isSelected === color
                                                    ? 'border-black scale-105'
                                                    : 'border-gray-300'
                                                    } transition`}
                                                onClick={() => setIsSelected(color)}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {data?.sizes?.length > 0 && (
                                <div>
                                    <strong>Size:</strong>
                                    <div className="flex gap-2 mt-2">
                                        {data.sizes.map((size: string, index: number) => (
                                            <button
                                                key={index}
                                                onClick={() => setIsSizeSelected(size)}
                                                className={`px-3 py-1 rounded-md border transition ${isSizeSelected === size
                                                    ? 'bg-gray-800 text-white'
                                                    : 'bg-gray-200 text-black'
                                                    }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Price, Quantity, Actions */}
                        <div className="mt-5">
                            <div className="flex gap-4 items-end">
                                <h3 className="text-2xl font-semibold text-gray-800">
                                    ${data?.sale_price}
                                </h3>
                                {data?.regular_price && (
                                    <span className="text-red-500 line-through text-lg">
                                        ${data.regular_price}
                                    </span>
                                )}
                            </div>

                            <div className="mt-4 flex gap-4 items-center">
                                {/* Quantity Selector */}
                                <div className="flex items-center border rounded-md overflow-hidden">
                                    <button
                                        onClick={() =>
                                            setQuantity((q) => Math.max(1, q - 1))
                                        }
                                        className="bg-gray-200 px-3 py-1 hover:bg-gray-300"
                                    >
                                        -
                                    </button>
                                    <span className="px-4 py-1 bg-gray-100">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity((q) => q + 1)}
                                        className="bg-gray-200 px-3 py-1 hover:bg-gray-300"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Add to Cart */}
                                <button
                                    className={`flex items-center gap-2 bg-[#ff5722] text-white px-5 py-2 rounded hover:bg-[#e64a19] ${isInCart ? "cursor-not-allowed" : "cursor-pointer"}`}
                                    disabled={isInCart}
                                    onClick={() =>
                                        addToCart({
                                            ...data,
                                            quantity,
                                            selectedOptions: {
                                                color: isSelected,
                                                size: isSizeSelected,
                                            },
                                            user,
                                            location,
                                            deviceInfo
                                        })
                                    }
                                >
                                    <ShoppingCart size={18} />
                                    Add to Cart
                                </button>

                                {/* Wishlist */}
                                <button className="text-gray-700 opacity-[.7] hover:text-black transition">
                                    <HeartIcon size={20}
                                        fill={isWishlisted ? 'red' : 'transparent'}
                                        color={isWishlisted ? 'transparent' : 'red'}
                                        onClick={() => {
                                            isWishlisted
                                                ? removeFromWishlist(data.id, user, location, deviceInfo)
                                                : addToWishlist({
                                                    ...data,
                                                    quantity,
                                                    selectedOptions: {
                                                        color: isSelected,
                                                        size: isSizeSelected
                                                    },
                                                    user,
                                                    location,
                                                    deviceInfo
                                                })
                                        }}
                                    />
                                </button>
                            </div>

                            {/* Stock Status */}
                            <div className="mt-3">
                                {data.stock > 0 ? (
                                    <span className="text-green-600 font-semibold">
                                        In Stock
                                    </span>
                                ) : (
                                    <span className="text-red-600 font-semibold">
                                        Out of Stock
                                    </span>
                                )}
                            </div>{" "}
                            <div className='mt-3 text-gray-600 text-sm'>
                                Estimated Delivery:{" "}
                                <strong>{estimatedDelivery.toDateString()}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetailsCard
