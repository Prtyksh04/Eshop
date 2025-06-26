'use client'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import { ArrowLeft, Loader2 } from 'lucide-react'
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
            <div className='flex justify-center items-center h-[40vh]'>
                <Loader2 className='animate-spin w-6 h-6 text-gray-600' />
            </div>
        )
    }

    if (!order) {
        return <p className='text-center text-sm text-red-500'>Order not found.</p>
    }

      return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="my-4">
        <span
          className="text-white flex items-center gap-2 font-semibold cursor-pointer"
          onClick={() => router.push("/dashboard/orders")}
        >
          <ArrowLeft />
          Go Back to Dashboard
        </span>
      </div>

      <h1 className="text-2xl font-bold text-gray-200 mb-4">
        Order ${order.id.slice(-6)}
      </h1>

      {/* Status Selector */}
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-300 mr-3">
          Update Delivery Status:
        </label>
        <select
          value={order.deliveryStatus}
          onChange={handleStatusChange}
          disabled={updating}
          className="border bg-transparent text-gray-200 border-gray-300 rounded-md px-2 py-1"
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

      {/* Status Tracker Text */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-medium text-gray-400">
          {statuses.map((step, idx) => {
            const current = step === order.deliveryStatus
            const passed = statuses.indexOf(order.deliveryStatus) >= idx

            return (
              <div
                key={step}
                className={`flex-1 text-left ${
                  current
                    ? "text-blue-600"
                    : passed
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {step}
              </div>
            )
          })}
        </div>
      </div>

      {/* Status Tracker Visual */}
      <div className="flex items-center">
        {statuses.map((step, idx) => {
          const reached = idx <= statuses.indexOf(order.deliveryStatus)

          return (
            <div key={step} className="flex-1 flex items-center">
              <div
                className={`w-4 h-4 rounded-full ${
                  reached ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
              {idx !== statuses.length - 1 && (
                <div
                  className={`flex-1 h-1 ${
                    reached ? "bg-blue-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Page