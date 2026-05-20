'use client'
import axiosInstance from 'apps/user-ui/src/utils/axiosInstance';
import { Loader2 } from 'lucide-react';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const params = useParams();
    const orderId = params.orderId as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const res = await axiosInstance.get(
                    `/order/api/get-order-details/${orderId}`
                );
                setOrder(res.data.order);
            } catch (err) {
                console.error("Failed to fetch order details", err);
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            fetchOrder();
        }
    }, [orderId])

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[40vh]'>
                <Loader2 className='animate-spin w-6 h-6 text-gray-600' />
            </div>
        )
    }

    if (!order) {
        return <p className='text-center text-sm text-red-500'>Order not found.</p>
    }

    return (
        <div className='max-w-5xl mx-auto px-5 py-10'>
            <h1 className='text-2xl font-bold text-gray-800 mb-4'>
                Order #{order.id.slice(-6)}
            </h1>
            {/* Delivery progress work */}
            <div className='my-4'>
                <div className='flex items-center justify-between text-xs font-medium text-gray-500 mb-2'>
                    {[
                        "Ordered",
                        "Packed",
                        "Shipped",
                        "Out for Delivery",
                        "Delivered"
                    ].map((step, idx) => {
                        const current = step.toLowerCase() === (order.deliveryStatus || "processing").toLowerCase();
                        const passed = idx <= [
                            "Ordered",
                            "Packed",
                            "Shipped",
                            "Out for Delivery",
                            "Delivered"
                        ].findIndex((s) => s.toLowerCase() === (order.deliveryStatus || "processing").toLowerCase())
                        return (
                            <div
                                key={step}
                                className={`flex-1 text-left ${current ? 'text-blue-600' : passed ? 'text-green-600' : 'text-gray-400'
                                    }`}
                            >
                                {step}
                            </div>
                        )
                    })}
                </div>
                <div className='flex items-center'>
                    {[
                        "Ordered",
                        "Packed",
                        "Shipped",
                        "Out for Delivery",
                        "Delivered"
                    ].map((step, idx) => {
                        const isReached = idx <= [
                            "Ordered",
                            "Packed",
                            "Shipped",
                            "Out for Delivery",
                            "Delivered"
                        ].findIndex((s) => s.toLowerCase() === (order.deliveryStatus || "processing").toLowerCase())
                        return (
                            <div key={step} className='flex-1 flex items-center'>
                                <div className={`w-4 h-4 rounded-full ${isReached ? 'bg-blue-600' : 'bg-gray-300'
                                    }`} />
                                {idx != 4 && (
                                    <div className={`flex-1 h-1 ${isReached ? "bg-blue-500" : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Summary info */}
            <div className='mb-6 space-y-1 text-sm text-gray-700'>
                <p>
                    <span className='font-semibold'>Payment Status:</span>{" "}
                    <span className='text-green-600 font-medium'>{order.status}</span>
                </p>
                <p>
                    <span className='font-semibold'>Total Paid:</span>{" "}
                    <span className='font-medium'>₹{order.total.toFixed(2)}</span>
                </p>
                {order.discountAmount > 0 && (
                    <p>
                        <span className='font-semibold'>Discount Applied:</span>{" "}
                        <span className='text-green-700'>
                            -₹{order.discountAmount.toFixed(2)} (
                            {order.couponCode?.discountType === 'percentage'
                                ? `${order.couponCode.discountValue}%` :
                                `₹${order.couponCode.discountValue}`}{" "}
                            )
                        </span>
                    </p>
                )}
                {order.couponCode && (
                    <p>
                        <span className='font-semibold'>Coupon: </span>{" "}
                        <span className='text-blue-700'>
                            {order.couponCode.public_name}
                        </span>
                    </p>
                )}
                <p>
                    <span className='font-semibold'>Date: </span>
                    {new Date(order.createdAt).toLocaleDateString()}
                </p>
            </div>
            {/* Shipping info */}
            {order.shippingAddress && (
                <div className='mb-6 text-sm text-gray-700 bg-white p-4 rounded-md border border-gray-200'>
                    <h2 className='text-md font-semibold mb-2 text-gray-800'>Shipping Address</h2>
                    <p className='font-medium'>{order.shippingAddress.name}</p>
                    <p className='text-gray-600'>
                        {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.zip}
                    </p>
                    <p className='text-gray-600'>{order.shippingAddress.country}</p>
                </div>
            )}
            {/* Order items */}
            <div>
                <h2 className='text-lg font-semibold text-gray-700 mb-4'>Order Items</h2>
                <div className='space-y-4'>
                    {order.items.map((item: any) => (
                        <div
                            key={item.productId}
                            className='border border-gray-200 rounded-md p-4 flex items-center bg-white'
                        >
                            <img
                                src={item.product?.images[0]?.url || "/placeholder.png"}
                                alt={item.product?.title || "Product image"}
                                className='w-16 h-16 object-cover rounded-md border border-gray-200'
                            />
                            <div className='flex-1 ml-4'>
                                <p className='font-medium text-gray-800'>
                                    {item.product?.title || "Unnamed product"}
                                </p>
                                <p className='text-sm text-gray-600'>
                                    Quantity: {item.quantity}
                                </p>
                                {item.selectedOptions &&
                                    Object.keys(item.selectedOptions).length > 0 && (
                                        <div className='text-xs text-gray-500 mt-1 flex flex-wrap gap-2'>
                                            {Object.entries(item.selectedOptions).map(
                                                ([key, value]: [string, any]) =>
                                                    value && (
                                                        <span key={key}
                                                            className='mr-3 flex gap-2 items-center'
                                                        >
                                                            <span className='font-medium capitalize'>
                                                                {key}:
                                                            </span>{" "}
                                                            <span
                                                                className='w-3 h-3 rounded-full block border border-gray-300'
                                                                style={{ backgroundColor: value }}
                                                            ></span>
                                                        </span>
                                                    )
                                            )}
                                        </div>
                                    )
                                }
                            </div>
                            <p className='text-sm font-semibold text-gray-800'>
                                ₹{item.price.toFixed(2)}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default page