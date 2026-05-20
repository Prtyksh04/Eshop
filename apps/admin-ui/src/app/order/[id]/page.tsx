'use client'
import axiosInstance from 'apps/admin-ui/src/utils/axiosInstance'
import { ArrowLeft, Loader2, Calendar, User, Mail, MapPin, ShoppingBag } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const statuses = [
    "Ordered",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
]

const Page = () => {

    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const router = useRouter();

    const fetchOrder = async () => {
        try {
            const res = await axiosInstance.get(`/order/api/get-order-details/${orderId}`);
            setOrder(res.data.order);
        } catch (error) {
            setLoading(false);
            console.error("Failed to fetch order details", error);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        setUpdating(true);
        try {
            await axiosInstance.put(`/order/api/update-status/${order.id}`, {
                deliveryStatus: newStatus
            });
            setOrder((prev: any) => ({ ...prev, deliveryStatus: newStatus }));
        } catch (error) {
            console.error("Failed to update status", error);
        } finally {
            setUpdating(false);
        }
    }

    useEffect(() => {
        if (orderId) fetchOrder();
    }, [orderId]);

    if (loading) {
        return (
            <div className='flex justify-center items-center h-[50vh] bg-slate-50'>
                <Loader2 className='animate-spin w-8 h-8 text-blue-600' />
            </div>
        )
    }

    if (!order) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-10 bg-slate-50 min-h-screen">
                <p className='text-center text-sm text-red-500 font-semibold'>Order not found.</p>
            </div>
        )
    }

    const subtotal = order.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    const discount = order.discountAmount || 0;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                {/* Back Link */}
                <div className="mb-6">
                    <button
                        className="text-slate-600 hover:text-blue-600 flex items-center gap-2 font-medium transition"
                        onClick={() => router.push("/dashboard/orders")}
                    >
                        <ArrowLeft size={18} />
                        Go Back to Orders
                    </button>
                </div>

                {/* Header Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-800">
                                Order #{order.id.slice(-6).toUpperCase()}
                            </h1>
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Paid' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5 font-medium">
                            <Calendar size={14} />
                            Ordered on {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-700">
                            Update Delivery Status:
                        </label>
                        <select
                            value={order.deliveryStatus}
                            onChange={handleStatusChange}
                            disabled={updating}
                            className="border border-slate-200 bg-white text-slate-800 rounded-lg px-3 py-1.5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        >
                            {statuses.map((status) => {
                                const currentIndex = statuses.indexOf(order.deliveryStatus)
                                const statusIndex = statuses.indexOf(status)

                                return (
                                    <option
                                        key={status}
                                        value={status}
                                        disabled={statusIndex < currentIndex}
                                    >
                                        {status}
                                    </option>
                                )
                            })}
                        </select>
                    </div>
                </div>

                {/* Progress Tracker Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
                    <h2 className="text-sm font-semibold text-slate-700 mb-6">Delivery Progress</h2>
                    <div className="relative flex items-center justify-between">
                        {/* Connecting Line */}
                        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
                        <div 
                            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 transition-all duration-500 -z-0"
                            style={{ 
                                width: `${(statuses.indexOf(order.deliveryStatus) / (statuses.length - 1)) * 100}%` 
                            }}
                        />

                        {statuses.map((step, idx) => {
                            const reached = idx <= statuses.indexOf(order.deliveryStatus);
                            const current = step === order.deliveryStatus;

                            return (
                                <div key={step} className="relative z-10 flex flex-col items-center flex-1">
                                    <div
                                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                                            reached 
                                                ? "bg-blue-600 border-blue-600 text-white" 
                                                : "bg-white border-slate-200 text-slate-400"
                                        }`}
                                    >
                                        {reached ? (
                                            <span className="text-xs">✓</span>
                                        ) : (
                                            <span className="text-xs font-semibold">{idx + 1}</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] sm:text-xs font-medium mt-2 text-center ${
                                        current 
                                            ? "text-blue-600 font-bold" 
                                            : reached 
                                                ? "text-slate-800 font-semibold" 
                                                : "text-slate-400"
                                    }`}>
                                        {step}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Two-Column Grid: Customer & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Customer Info Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                            <User size={18} className="text-blue-500" />
                            <h3>Customer Information</h3>
                        </div>
                        {order.user ? (
                            <div className="space-y-2.5">
                                <p className="text-sm">
                                    <span className="text-slate-500 font-medium block">Name</span>
                                    <span className="text-slate-800 font-semibold">{order.user.name}</span>
                                </p>
                                <p className="text-sm">
                                    <span className="text-slate-500 font-medium block">Email Address</span>
                                    <span className="text-slate-800 font-semibold flex items-center gap-1.5">
                                        <Mail size={14} className="text-slate-400" />
                                        {order.user.email}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No customer details linked.</p>
                        )}
                    </div>

                    {/* Shipping Details Card */}
                    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                            <MapPin size={18} className="text-blue-500" />
                            <h3>Shipping Address</h3>
                        </div>
                        {order.shippingAddress ? (
                            <div className="space-y-1">
                                <p className="text-sm font-semibold text-slate-800">{order.shippingAddress.name}</p>
                                <p className="text-sm text-slate-600">{order.shippingAddress.street}</p>
                                <p className="text-sm text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                                <p className="text-sm text-slate-600 font-medium">{order.shippingAddress.country}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">No shipping details provided.</p>
                        )}
                    </div>
                </div>

                {/* Items Ordered Card */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
                    <div className="flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4">
                        <ShoppingBag size={18} className="text-blue-500" />
                        <h3>Items Ordered</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-400 font-medium text-left">
                                    <th className="pb-3 font-semibold">Product</th>
                                    <th className="pb-3 text-center font-semibold">Quantity</th>
                                    <th className="pb-3 text-right font-semibold">Price</th>
                                    <th className="pb-3 text-right font-semibold">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {order.items.map((item: any) => (
                                    <tr key={item.productId} className="text-slate-700">
                                        <td className="py-3.5 flex items-center gap-3">
                                            <img
                                                src={item.product?.images[0]?.url || "/placeholder.png"}
                                                alt={item.product?.title || "Product Image"}
                                                className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                                            />
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {item.product?.title || "Unnamed Product"}
                                                </p>
                                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                    <div className="text-xs text-slate-400 mt-1 flex flex-wrap gap-2">
                                                        {Object.entries(item.selectedOptions).map(([key, value]: [string, any]) =>
                                                            value && (
                                                                <span key={key} className="flex gap-1.5 items-center">
                                                                    <span className="capitalize">{key}:</span>
                                                                    <span 
                                                                        className="w-3 h-3 rounded-full border border-slate-300 block" 
                                                                        style={{ backgroundColor: value }}
                                                                    />
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 text-center text-slate-800 font-medium">
                                            {item.quantity}
                                        </td>
                                        <td className="py-3.5 text-right font-semibold text-slate-800">
                                            ₹{item.price.toFixed(2)}
                                        </td>
                                        <td className="py-3.5 text-right font-semibold text-slate-900">
                                            ₹{(item.price * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals Section */}
                <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-end">
                    <div className="w-full sm:w-80 space-y-3 text-sm">
                        <div className="flex justify-between text-slate-600">
                            <span>Subtotal</span>
                            <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                        </div>
                        {discount > 0 && (
                            <div className="flex justify-between text-green-600 font-semibold">
                                <span>Discount {order.couponCode ? `(${order.couponCode.public_name})` : ''}</span>
                                <span>-₹{discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-slate-600">
                            <span>Delivery</span>
                            <span className="font-semibold text-green-600 font-medium">Free</span>
                        </div>
                        <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-base text-slate-900">
                            <span>Total Earnings</span>
                            <span>₹{order.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page