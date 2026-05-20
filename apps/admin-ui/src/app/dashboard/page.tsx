'use client'
import React from 'react'
import { DollarSign, Users, Store, TrendingUp, ArrowUpRight, ShieldCheck } from 'lucide-react'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { mockOrders } from '../../utils/mockData'

const categoryData = [
  { name: 'Electronics', sales: 45000 },
  { name: 'Fashion', sales: 38000 },
  { name: 'Gadgets', sales: 29000 },
  { name: 'Home & Living', sales: 18500 },
  { name: 'Beauty', sales: 15300 },
];

const userDistData = [
  { name: 'Buyers', value: 1040 },
  { name: 'Sellers', value: 200 },
];
const COLORS = ['#2563eb', '#10b981'];

const Page = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-slate-800">
        <div>
          <span className="bg-indigo-500/30 text-indigo-200 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm border border-indigo-400/20 flex items-center gap-1.5 w-max">
            <ShieldCheck size={14} /> System Administrator
          </span>
          <h1 className="text-3xl font-bold mt-3 mb-2">Vendora Management Console</h1>
          <p className="text-slate-300 max-w-xl text-sm leading-relaxed">
            Monitor platform health, track marketplace trading volume, manage registered users and seller storefronts, and oversee global system settings.
          </p>
        </div>
        <div className="flex gap-4 bg-white/5 p-4 rounded-xl backdrop-blur-md border border-white/10">
          <div className="text-center px-4 border-r border-white/10">
            <p className="text-xs text-slate-400 font-medium">Platform Uptime</p>
            <p className="text-2xl font-bold mt-1 text-emerald-400">99.98%</p>
          </div>
          <div className="text-center px-4">
            <p className="text-xs text-slate-400 font-medium">Active Sessions</p>
            <p className="text-2xl font-bold mt-1 text-indigo-400">1,428</p>
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
              <ArrowUpRight size={14} /> +18.2%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Marketplace Volume</p>
          <h3 className="text-2xl font-bold text-slate-900">$145,800.00</h3>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ArrowUpRight size={14} /> +12.4%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-slate-900">1,240</h3>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
              <Store size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ArrowUpRight size={14} /> +6.8%
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Verified Shops</p>
          <h3 className="text-2xl font-bold text-slate-900">48 Stores</h3>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="flex justify-between items-center mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              10% Cut
            </span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Platform Revenue</p>
          <h3 className="text-2xl font-bold text-slate-900">$14,580.00</h3>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Sales by Category</h3>
              <p className="text-xs text-slate-500 mt-1">Platform trading volume across primary marketplace sectors</p>
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                />
                <Bar dataKey="sales" fill="#2563eb" radius={[8, 8, 0, 0]} maxBarSize={48} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">User Distribution</h3>
            <p className="text-xs text-slate-500 mt-1">Proportion of buyers vs active store owners</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userDistData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {userDistData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Platform Activity */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent Marketplace Transactions</h3>
            <p className="text-xs text-slate-500 mt-1">Live order feed across all registered seller storefronts</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-600">
              {mockOrders.orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-4 px-4 font-semibold text-slate-900">#TXN-{order.id.toUpperCase()}</td>
                  <td className="py-4 px-4">
                    <div className="font-medium text-slate-900">{order.user.name}</div>
                    <div className="text-xs text-slate-400">Verified Buyer</div>
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Completed
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right font-bold text-slate-900">${order.totalPrice.toFixed(2)}</td>
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