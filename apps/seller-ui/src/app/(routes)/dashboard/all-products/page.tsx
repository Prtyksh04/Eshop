'use client'
import React, { useMemo, useState } from 'react'

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table"

import {
    Search,
    Pencil,
    Trash,
    Eye,
    Plus,
    BarChart,
    Star,
    ChevronRight,
    Loader2
} from 'lucide-react'

import Link from 'next/link'
import axiosInstance from 'apps/seller-ui/src/utils/axiosInstance'
import toast from 'react-hot-toast'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import DeleteConfirmationModal from 'apps/seller-ui/src/shared/components/modals/DeleteConfirmationModal'



const ProductList = () => {

    const [globalFilter, setGlobalFilter] = useState('')
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>();

    const queryClient = useQueryClient();

    const fetchProducts = async () => {
        const res = await axiosInstance.get("/product/api/get-shop-products");
        return res.data.product;
    }

    const deleteProduct = async (productId: string) => {
        await axiosInstance.delete(`/product/api/delete-product/${productId}`);
    }

    const restoreProduct = async (productId: string) => {
        await axiosInstance.put(`/product/api/restore-product/${productId}`);
    }

    const openDeleteModal = (product: any) => {
        setSelectedProduct(product);
        setShowDeleteModal(true);
    }

    const { data: products = [], isLoading } = useQuery({
        queryKey: ['shop-products'],
        queryFn: fetchProducts,
        staleTime: 1000 * 60 * 5,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-products'] });
            setShowDeleteModal(false);
            toast.success("Product deleted successfully");
        }
    })

    const restoreMutation = useMutation({
        mutationFn: restoreProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shop-products'] });
            setShowDeleteModal(false);
            toast.success("Product restored successfully");
        }
    })

    const columns = useMemo(
        () => [
            {
                accessorKey: "image",
                header: "Image",
                cell: ({ row }: any) => (
                    <Image
                        src={row.original.images[0]?.url || "/placeholder.png"}
                        alt={row.original.title}
                        width={48}
                        height={48}
                        className='w-12 h-12 rounded-md object-cover border border-slate-200'
                    />
                )
            }, {
                accessorKey: 'name',
                header: "Product Name",
                cell: ({ row }: any) => {
                    const truncatedTitle =
                        row.original.title.length > 35
                            ? `${row.original.title.substring(0, 35)}...`
                            : row.original.title

                    return (
                        <Link
                            href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                            target="_blank"
                            className='text-blue-600 hover:text-blue-800 hover:underline font-semibold'
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
                cell: ({ row }: any) => <span className="font-semibold text-slate-800">₹{row.original.sale_price.toFixed(2)}</span>
            }, {
                accessorKey: 'stock',
                header: "Stock",
                cell: ({ row }: any) =>
                    <span className={`font-medium ${row.original.stock < 10 ? 'text-rose-600' : 'text-slate-700'}`}>
                        {row.original.stock} left
                    </span>
            }, {
                accessorKey: 'category',
                header: "Category",
                cell: ({ row }: any) => <span className="text-slate-600">{row.original.category}</span>
            }, {
                accessorKey: 'rating',
                header: "Rating",
                cell: ({ row }: any) => (
                    <div className='flex items-center gap-1'>
                        <Star size={16} className="text-amber-400 fill-amber-400" />
                        <span className='text-slate-600 font-medium'>{row.original.ratings || 5}</span>
                    </div>
                )
            }, {
                header: 'Actions',
                cell: ({ row }: any) => (
                    <div className='flex gap-3'>
                        <Link
                            href={`${process.env.NEXT_PUBLIC_USER_UI_LINK}/product/${row.original.slug}`}
                            target="_blank"
                            className='text-slate-600 hover:text-blue-600 transition'
                            title="View Product"
                        >
                            <Eye size={18} />
                        </Link>
                        <button
                            onClick={() => toast.error("Product editing is currently disabled. Please contact support.")}
                            className='text-slate-600 hover:text-amber-600 transition'
                            title="Edit Product"
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            className='text-slate-600 hover:text-emerald-600 transition'
                            onClick={() => toast.success("Analytics dashboard coming soon!")}
                            title="View Analytics"
                        >
                            <BarChart size={18} />
                        </button>
                        <button
                            className='text-slate-600 hover:text-rose-600 transition'
                            onClick={() => openDeleteModal(row.original)}
                            title="Delete Product"
                        >
                            <Trash size={18} />
                        </button>

                    </div>
                )
            }
        ],
        []
    )

    const table = useReactTable({
        data: products,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: 'includesString',
        state: { globalFilter },
        onGlobalFilterChange: setGlobalFilter
    });

    return (
        <div className='w-full min-h-screen p-8 text-slate-800 bg-slate-50'>
            {/* Header */}
            <div className='flex justify-between items-center mb-1'>
                <h2 className='text-2xl text-slate-800 font-bold'>
                    All Products
                </h2>
                <Link
                    className='bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-sm transition'
                    href={'/dashboard/create-product'}
                >
                    <Plus size={18} /> Add Product
                </Link>
            </div>

            {/* Breadcrumbs */}
            <div className='flex items-center text-slate-500 mb-6 text-sm font-medium'>
                <Link href={'/dashboard'} className='text-blue-600 hover:underline cursor-pointer'>Dashboard</Link>
                <ChevronRight size={16} className='mx-1' />
                <span className='text-slate-600'>All Products</span>
            </div>

            {/* Search bar */}
            <div className='mb-6 flex items-center bg-white border border-slate-200 p-2.5 rounded-lg max-w-md shadow-sm'>
                <Search size={18} className='text-slate-400 mr-2' />
                <input type="text"
                    placeholder='Search Products...'
                    className='w-full bg-transparent text-slate-800 outline-none placeholder-slate-400 text-sm'
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            {/* Table Card */}
            <div className='overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm p-4'>
                {isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <Loader2 className="animate-spin text-blue-600 h-8 w-8" />
                    </div>
                ) : (
                    <table className='w-full text-slate-700 text-sm'>
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id} className='border-b border-slate-100'>
                                    {headerGroup.headers.map((header) => (
                                        <th key={header.id} className='p-3 text-left font-semibold text-slate-500 uppercase tracking-wider text-xs bg-slate-50/55'>
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
                        <tbody className="divide-y divide-slate-100">
                            {table.getRowModel().rows.map((row) => (
                                <tr
                                    key={row.id}
                                    className='hover:bg-slate-50/70 transition'
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className='p-3 align-middle'>
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
                {showDeleteModal && (
                    <DeleteConfirmationModal
                        product={selectedProduct}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={() => deleteMutation.mutate(selectedProduct?.id)}
                        onRestore={() => restoreMutation.mutate(selectedProduct?.id)}
                    />
                )}
            </div>
        </div>
    )
}

export default ProductList
