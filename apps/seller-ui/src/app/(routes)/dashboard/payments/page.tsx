'use client'
import React, { useMemo, useState } from 'react'
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from "@tanstack/react-table"

import { Search, Eye, ChevronRight, Loader2 } from 'lucide-react'
import { useQuery } from "@tanstack/react-query"
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import Link from 'next/link'

const fetchOrder = async () => {
    const res = await axiosInstance.get("/order/api/get-seller-orders");
    return res.data.orders;
}



const SellerPayments = () => {
    const [globalFilter, setGlobalFilter] = useState("");

    const { data: orders = [], isLoading } = useQuery({
        queryKey: ['seller-orders'],
        queryFn: fetchOrder,
        staleTime: 1000 * 60 * 5,
    });

    const columns = useMemo(() => [
        {
            accessorKey: "id",
            header: "Order ID",
            cell: ({ row }: any) => (
                <span className='text-slate-800 font-semibold text-sm'>
                    #{row.original.id.slice(-6).toUpperCase()}
                </span>
            )
        }, {
            accessorKey: 'user.name',
            header: "Buyer",
            cell: ({ row }: any) => (
                <span className='text-slate-700 font-medium'>
                    {row.original.user?.name ?? "Guest"}
                </span>
            )
        }, {
            header: "Seller Earning (90%)",
            cell: ({ row }: any) => {
                const sellerShare = row.original.total * 0.9;
                return (
                    <span className='text-emerald-600 font-semibold text-sm'>
                        ₹{sellerShare.toFixed(2)}
                    </span>
                )
            }
        }, {
            header: "Platform Fee (10%)",
            cell: ({ row }: any) => {
                const adminFee = row.original.total * 0.1;
                return (
                    <span className='text-slate-600 font-medium text-sm'>
                        ₹{adminFee.toFixed(2)}
                    </span>
                )
            }
        }, {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }: any) => {
                const isPaid = row.original.status === "Paid";
                return (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        isPaid 
                            ? "bg-green-50 text-green-700 border-green-200" 
                            : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}>
                        {row.original.status}
                    </span>
                );
            }
        },
        {
            accessorKey: 'createdAt',
            header: "Date",
            cell: ({ row }: any) => {
                const date = new Date(row.original.createdAt).toLocaleDateString();
                return <span className='text-slate-500 text-sm'>{date}</span>
            }
        }, {
            header: "Actions",
            cell: ({ row }: any) => (
                <Link
                    href={`/order/${row.original.id}`}
                    className='text-blue-600 hover:text-blue-800 transition inline-flex items-center gap-1.5 font-medium text-sm'
                >
                    <Eye size={16} />
                    <span>Details</span>
                </Link>
            )
        }
    ]
        , []
    );


    const table = useReactTable({
        data: orders,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: "includesString",
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter
    })

    return (
        <div className='w-full min-h-screen p-8 text-slate-800 bg-slate-50'>
            <div className="text-2xl text-slate-800 font-bold mb-2">Payments</div>

            {/* Breadcrumb */}
            <div className='flex items-center text-slate-500 mb-6 text-sm font-medium'>
                <Link href={'/dashboard'} className='text-blue-600 hover:underline cursor-pointer'>Dashboard</Link>
                <ChevronRight size={16} className='mx-1' />
                <span className='text-slate-600'>Payments</span>
            </div>

            {/* Search Bar */}
            <div className="mb-6 flex items-center bg-white border border-slate-200 p-2.5 rounded-lg max-w-md shadow-sm">
                <Search size={18} className="text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search Payments..."
                    className="w-full bg-transparent text-slate-800 outline-none placeholder-slate-400 text-sm"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Table Card */}
            <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
                    </div>
                ) : (
                    <table className="w-full text-slate-700 text-sm">
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className="border-b border-slate-100">
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className="p-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs bg-slate-50/55">
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className="hover:bg-slate-50/70 transition"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className="p-3 align-middle">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!isLoading && orders?.length === 0 && (
                    <p className="text-center py-10 text-slate-500 font-medium">No Orders found!</p>
                )}
            </div>
        </div>
    )
}

export default SellerPayments