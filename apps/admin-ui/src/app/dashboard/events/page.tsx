'use client'
import React, { useDeferredValue, useMemo, useState } from 'react'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table"

import {
    Search,
    ChevronRight,
    Download
} from 'lucide-react'

import { saveAs } from 'file-saver'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'
import axiosInstance from 'apps/admin-ui/src/utils/axiosInstance'

const ProductList = () => {
    const [globalFilter, setGlobalFilter] = useState('')
    const deferredFilter = useDeferredValue(globalFilter)
    const [page, setPage] = useState(1)
    const limit = 10

    const { data, isLoading } = useQuery({
        queryKey: ['events-list', page],
        queryFn: async () => {
            const res = await axiosInstance.get(`/admin/api/get-all-events?page=${page}&limit=${limit}`)
            return res.data
        },
        placeholderData: (prev) => prev,
        staleTime: 1000 * 60 * 5,
    })

    const allEvents = data?.data || []

    const filterEvents = useMemo(() => {
        return allEvents.fiter((event: any) => {
            const values = Object.values(event).join(" ").toLowerCase();
            return values.includes(deferredFilter.toLowerCase())
        })
    }, [allEvents, deferredFilter])

    const totalPages = Math.ceil((data?.meta?.totalProducts ?? 0) / limit)

    const columns = useMemo(
        () => [
            {
                accessorKey: "image",
                header: "Image",
                cell: ({ row }: any) => (
                    <Image
                        src={row.original.images[0]?.url}
                        alt={row.original.images}
                        width={200}
                        height={200}
                        className='w-12 h-12 rounded-md object-cover'
                    />
                )
            },
            {
                accessorKey: 'name',
                header: "Product Name",
                cell: ({ row }: any) => {
                    const truncatedTitle =
                        row.original.title.length > 25
                            ? `${row.original.title.substring(0, 25)}...`
                            : row.original.title

                    return (
                        <Link
                            href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                            className='text-blue-400 hover:underline'
                            title={row.original.title}
                        >
                            {truncatedTitle}
                        </Link>
                    )
                }
            },
            {
                accessorKey: 'price',
                header: "Price",
                cell: ({ row }: any) => <span>${row.original.sale_price}</span>
            },
            {
                accessorKey: 'stock',
                header: "Stock",
                cell: ({ row }: any) =>
                    <span className={row.original.stock < 10 ? 'text-red-500' : 'text-white'}>
                        {row.original.stock} left
                    </span>
            }, {
                accessorKey: 'starting_date',
                header: "Start,",
                cell: ({ row }) =>
                    new Date(row.original.starting_date).toLocaleDateString(),
            }, {
                accessorKey: 'ending_date',
                header: 'End',
                cell: ({ row }) =>
                    new Date(row.original.ending_date).toLocaleDateString(),
            }, {
                accessorKey: "Shop name",
                header: "Shop Name",
                cell: ({ row }) => row.original.Shop?.name || '-',
            }
        ],
        []
    )

    const table = useReactTable({
        data: filterEvents,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter
    })

    // const saveAs = (blob: Blob, filename: string) => {
    //     const url = window.URL.createObjectURL(blob)
    //     const a = document.createElement('a')
    //     a.href = url
    //     a.download = filename
    //     a.style.display = 'none'
    //     document.body.appendChild(a)
    //     a.click()
    //     document.body.removeChild(a)
    //     window.URL.revokeObjectURL(url)
    // }

    const exportCSV = () => {
        const csvRows = filterEvents.map((p: any) =>
            `${p.title},${p.slug},${p.sale_price},${p.stock},${p.category?.name || ''},${p.ratings}`
        )
        const blob = new Blob(
            [`Title,Slug,Price,Stock,Category,Rating\n${csvRows.join('\n')}`],
            { type: 'text/csv;charset=utf-8;' }
        )

        saveAs(blob, `products-page-${page}.csv`)
    }

    return (
        <div className='w-full min-h-screen p-8'>
            {/* Header */}
            <div className='flex justify-between items-center mb-1'>
                <h2 className='text-2xl text-white font-semibold'>
                    All Products
                </h2>
                <button
                    className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2'
                    onClick={exportCSV}
                >
                    <Download size={18} /> Export CSV
                </button>
            </div>

            {/* Breadcrumbs */}
            <div className='flex items-center text-white mb-4'>
                <Link href={'/dashboard'} className='text-[#80Deea] cursor-pointer'>Dashboard</Link>
                <ChevronRight size={20} className='opacity-[.8]' />
                <span className='text-white'>All Products</span>
            </div>

            {/* Search bar */}
            <div className='mb-4 flex items-center bg-gray-900 p-2 rounded-md flex-1'>
                <Search size={18} className='text-gray-400 mr-2' />
                <input type="text"
                    placeholder='Search Products...'
                    className='w-full bg-transparent text-white outline-none'
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className='overflow-x-auto bg-gray-900 rounded-lg p-4'>
                {isLoading ? (
                    <p className='text-center text-white'>Loading Products...</p>
                ) : (
                    <table className='w-full text-white'>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className='border-b border-gray-800'>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className='p-3 text-left'>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )
                                            }
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className='border-b border-gray-800 hover:bg-gray-800 transition'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className='p-3'>
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
            </div>

            {/* Pagination Controls */}
            <div className='flex justify-between items-center mt-4 text-white'>
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    disabled={page === 1}
                    className='px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50'
                >
                    Previous
                </button>

                <div className="text-sm">
                    Page <strong>{page}</strong> of <strong>{totalPages}</strong>
                </div>

                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={page === totalPages}
                    className='px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50'
                >
                    Next
                </button>
            </div>

            {/* Uncomment below if you want numbered page buttons */}
            {/* 
            <div className='flex gap-2 flex-wrap mt-4 text-white'>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                        key={pg}
                        onClick={() => setPage(pg)}
                        className={`px-3 py-1 rounded-md ${page === pg ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'}`}
                    >
                        {pg}
                    </button>
                ))}
            </div>
            */}
        </div>
    )
}

export default ProductList
