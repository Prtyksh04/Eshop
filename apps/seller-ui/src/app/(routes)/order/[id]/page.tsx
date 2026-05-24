'use client';

import { ArrowLeft, Calendar, Mail, MapPin, ShoppingBag, User } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { mockOrders } from '../../../../utils/mockData';

const statuses = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

const Page = () => {
  const params = useParams();
  const orderId = params.id as string;
  const router = useRouter();

  const [ordersState, setOrdersState] = useState(mockOrders.orders);
  const order = useMemo(
    () => ordersState.find((item) => item.id === orderId) ?? null,
    [ordersState, orderId]
  );

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
      }),
    []
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setOrdersState((prev) =>
      prev.map((item) =>
        item.id === orderId
          ? {
              ...item,
              deliveryStatus: newStatus,
            }
          : item
      )
    );
  };

  if (!order) {
    return (
      <div className='max-w-5xl mx-auto px-4 py-10 bg-slate-50 min-h-screen'>
        <p className='text-center text-sm text-red-500 font-semibold'>Order not found.</p>
      </div>
    );
  }

  const subtotal = order.items.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );
  const discount = order.discountAmount || 0;

  return (
    <div className='min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-5xl mx-auto'>
        <div className='mb-6'>
          <button
            className='text-slate-600 hover:text-blue-600 flex items-center gap-2 font-medium transition'
            onClick={() => router.push('/dashboard/orders')}
          >
            <ArrowLeft size={18} />
            Go Back to Orders
          </button>
        </div>

        <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
          <div>
            <div className='flex items-center gap-3'>
              <h1 className='text-2xl font-bold text-slate-800'>Order #{order.id}</h1>
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'Paid'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className='text-sm text-slate-500 mt-1 flex items-center gap-1.5'>
              <Calendar size={14} />
              Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </p>
          </div>

          <div className='flex items-center gap-3'>
            <label className='text-sm font-semibold text-slate-700'>Status:</label>
            <select
              value={order.deliveryStatus}
              onChange={handleStatusChange}
              className='border border-slate-300 bg-white text-slate-800 rounded-lg px-3 py-1.5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            >
              {statuses.map((status) => {
                const currentIndex = statuses.indexOf(order.deliveryStatus);
                const statusIndex = statuses.indexOf(status);

                return (
                  <option key={status} value={status} disabled={statusIndex < currentIndex}>
                    {status}
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6'>
          <h2 className='text-md font-semibold text-slate-700 mb-6'>Delivery Progress</h2>
          <div className='relative flex items-center justify-between'>
            <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0' />
            <div
              className='absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 transition-all duration-500 -z-0'
              style={{
                width: `${(statuses.indexOf(order.deliveryStatus) / (statuses.length - 1)) * 100}%`,
              }}
            />

            {statuses.map((step, idx) => {
              const reached = idx <= statuses.indexOf(order.deliveryStatus);
              const current = step === order.deliveryStatus;

              return (
                <div key={step} className='relative z-10 flex flex-col items-center flex-1'>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                      reached
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-400'
                    }`}
                  >
                    {reached ? (
                      <span className='text-xs'>OK</span>
                    ) : (
                      <span className='text-xs font-semibold'>{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] sm:text-xs font-medium mt-2 text-center ${
                      current
                        ? 'text-blue-600 font-bold'
                        : reached
                        ? 'text-slate-800'
                        : 'text-slate-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <div className='flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4'>
              <User size={18} className='text-blue-500' />
              <h3>Customer Information</h3>
            </div>
            {order.user ? (
              <div className='space-y-2.5'>
                <p className='text-sm'>
                  <span className='text-slate-500 font-medium block'>Name</span>
                  <span className='text-slate-800 font-semibold'>{order.user.name}</span>
                </p>
                <p className='text-sm'>
                  <span className='text-slate-500 font-medium block'>Email Address</span>
                  <span className='text-slate-800 font-semibold flex items-center gap-1.5'>
                    <Mail size={14} className='text-slate-400' />
                    {order.user.email}
                  </span>
                </p>
              </div>
            ) : (
              <p className='text-sm text-slate-500 italic'>No customer details linked.</p>
            )}
          </div>

          <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm'>
            <div className='flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4'>
              <MapPin size={18} className='text-blue-500' />
              <h3>Shipping Address</h3>
            </div>
            {order.shippingAddress ? (
              <div className='space-y-1'>
                <p className='text-sm font-semibold text-slate-800'>{order.shippingAddress.name}</p>
                <p className='text-sm text-slate-600'>{order.shippingAddress.street}</p>
                <p className='text-sm text-slate-600'>
                  {order.shippingAddress.city}, {order.shippingAddress.zip}
                </p>
                <p className='text-sm text-slate-600 font-medium'>{order.shippingAddress.country}</p>
              </div>
            ) : (
              <p className='text-sm text-slate-500 italic'>No shipping details provided.</p>
            )}
          </div>
        </div>

        <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6'>
          <div className='flex items-center gap-2 font-semibold text-slate-800 border-b border-slate-100 pb-3 mb-4'>
            <ShoppingBag size={18} className='text-blue-500' />
            <h3>Items Ordered</h3>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='border-b border-slate-100 text-slate-400 font-medium text-left'>
                  <th className='pb-3 font-semibold'>Product</th>
                  <th className='pb-3 text-center font-semibold'>Quantity</th>
                  <th className='pb-3 text-right font-semibold'>Price</th>
                  <th className='pb-3 text-right font-semibold'>Total</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-slate-100'>
                {order.items.map((item: any) => (
                  <tr key={item.productId} className='text-slate-700'>
                    <td className='py-3.5 flex items-center gap-3'>
                      <img
                        src={item.product?.images[0]?.url || '/placeholder.png'}
                        alt={item.product?.title || 'Product Image'}
                        className='w-12 h-12 object-cover rounded-lg border border-slate-200'
                      />
                      <div>
                        <p className='font-semibold text-slate-800'>
                          {item.product?.title || 'Unnamed Product'}
                        </p>
                      </div>
                    </td>
                    <td className='py-3.5 text-center text-slate-800 font-medium'>{item.quantity}</td>
                    <td className='py-3.5 text-right font-semibold text-slate-800'>
                      {currencyFormatter.format(item.price)}
                    </td>
                    <td className='py-3.5 text-right font-semibold text-slate-900'>
                      {currencyFormatter.format(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className='bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex justify-end'>
          <div className='w-full sm:w-80 space-y-3 text-sm'>
            <div className='flex justify-between text-slate-600'>
              <span>Subtotal</span>
              <span className='font-semibold'>{currencyFormatter.format(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className='flex justify-between text-green-600'>
                <span>Discount {order.couponCode ? `(${order.couponCode.public_name})` : ''}</span>
                <span className='font-semibold'>-{currencyFormatter.format(discount)}</span>
              </div>
            )}
            <div className='flex justify-between text-slate-600'>
              <span>Delivery</span>
              <span className='font-semibold text-green-600'>Free</span>
            </div>
            <div className='border-t border-slate-200 pt-3 flex justify-between font-bold text-base text-slate-900'>
              <span>Total Earnings</span>
              <span>{currencyFormatter.format(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
