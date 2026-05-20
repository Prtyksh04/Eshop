'use client'
import React from 'react'
import { DollarSign, Package, Clock, TrendingUp, ArrowUpRight, Eye } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { mockOrders } from '../../../utils/mockData'

const salesData = [
  { name: 'Jan', revenue: 4200, orders: 35 },
  { name: 'Feb', revenue: 3800, orders: 28 },
  { name: 'Mar', revenue: 5100, orders: 42 },
  { name: 'Apr', revenue: 4600, orders: 38 },
  { name: 'May', revenue: 6300, orders: 52 },
  { name: 'Jun', revenue: 7450, orders: 65 },
];

const Page = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="bg-blue-500/30 text-blue-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-blue-400/20">
            Store Active
          </span>
          <h1 className="text-3xl font-bold mt-3 mb-2">Welcome back, Vendora Official Shop!</h1>
          <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
            Here is your store's performance overview. Review recent orders, analyze sales trends, and manage your product listings to keep growing.
          </p>
        </div>
        <div className="flex gap-4 bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
          <div className="text-center px-4 border-r border-white/20">
            <p className="text-xs text-blue-200 font-medium">Today's Sales</p>
            <p className="text-2xl font-bold mt-1">$1,240</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-blue-200 font-medium">Store Visits</p>
            <p className="text-2xl font-bold mt-1">348</p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <DollarSign size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ArrowUpRight size={14} /> +14.5%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-slate-900">$12,450.00</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Package size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ArrowUpRight size={14} /> +8.2%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Active Products</p>
          <h3 className="text-2xl font-bold text-slate-900">24 Items</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              Pending
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Pending Orders</p>
          <h3 className="text-2xl font-bold text-slate-900">12 Orders</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ArrowUpRight size={14} /> +3.4%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Conversion Rate</p>
          <h3 className="text-2xl font-bold text-slate-900">4.8%</h3>
        </div>
      </div>

      {/* Analytics Chart Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Revenue Analytics</h3>
            <p className="text-xs text-slate-500 mt-1">Monthly sales performance over the last 6 months</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              <span className="text-xs font-medium text-slate-600">Revenue ($)</span>
            </div>
          </div>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Orders</h3>
            <p className="text-xs text-slate-500 mt-1">Latest customer transactions and order statuses</p>
          </div>
          <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition">
            View All Orders <ArrowUpRight size={14} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {mockOrders.orders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-semibold text-slate-900">#{order.id.toUpperCase()}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">{order.user.name}</div>
                    <div className="text-xs text-slate-400">{order.user.email}</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
                  <td className="py-4 px-4 text-center">
                    <button className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Page