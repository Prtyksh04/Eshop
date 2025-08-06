'use client'

import React, { useMemo, useState, useDeferredValue } from "react"

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getSortedRowModel
} from "@tanstack/react-table"

import { Download, Ban, Search, ChevronRight } from "lucide-react"
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance"
import { saveAs } from "file-saver"
import Link from "next/link"

// Types
type User = {
  id: string,
  name: string,
  email: string,
  role: string,
  createdAt: string,
}

type UsersResponse = {
  data: User[];
  meta: {
    totalUsers: number;
  }
}

const UsersPage = () => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const deferredGlobalFilter = useDeferredValue(globalFilter);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading }: UseQueryResult<UsersResponse, Error> = useQuery<
    UsersResponse,
    Error,
    UsersResponse,
    [string, number]
  >({
    queryKey: ['users-list', page],
    queryFn: async () => {
      const res = await axiosInstance.get(`/admin/api/get-all-users?page =${page}&limit=${limit}`);
      return res.data;
    },
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5,
  });

  const allUsers = data?.data || [];
  const filterUsers = useMemo(() => {
    return allUsers.filter((user) => {
      const matchesRole = roleFilter ? user.role.toLowerCase() === roleFilter.toLowerCase() : true;
      const matchesGlobal = deferredGlobalFilter ? Object.values(user).join(" ").toLowerCase().includes(deferredGlobalFilter.toLowerCase()) : true
      return matchesRole && matchesGlobal;
    })
  }, [allUsers, roleFilter, deferredGlobalFilter])

  const totalPages = Math.ceil((data?.meta?.totalUsers ?? 0) / limit);

  const columns = useMemo(() => [
    {
      accessKey: "name",
      header: "Name",

    }, {
      accessKey: "email",
      header: "Email"
    }, {
      accessKey: "role",
      header: "Role",
      cell: ({ row }: any) => (
        <span className="uppercase font-semibold text-blue-400">{row.original.role}</span>
      )
    }
  ], []);

  const table = useReactTable({
    data: filterUsers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
  });

  const exportToCSV = () => {
    const csvData = filterUsers.map(
      (user) => `${user.name},${user.email},${user.role},${user.createdAt}`
    );

    const blob = new Blob(
      [`Name,Email,Role,Created At\n${csvData.join("\n")}`],
      { type: "text/csv;charset=utf-8;" }
    );
    saveAs(blob, `users-page-${page}.csv`);
  }

  return (
    <div className="w-full min-h-screen p-8 bg-black text-white text-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-bold tracking-wide">All Users</h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-1"
            onClick={exportToCSV}>
            <Download size={16} /> Export CSV
          </button>
          <select
            className="bg-gray-800 border border-gray-700 outline-none text-white"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
        </div>
      </div>

      <div className='flex items-center text-white mb-4'>
        <Link href={'/dashboard'} className='text-[#80Deea] cursor-pointer'>Dashboard</Link>
        <ChevronRight size={20} className='opacity-[.8]' />
        <span className='text-white'>All Users</span>
      </div>

      {/* Select Bar */}
      <div className="mb-4 flex items-center bg-gray-900 p-2 rounded-md flex-1">
        <Search size={18} className="text-gray-400 mr-2" />
        <input type="text"
          placeholder="Search users..."
          className="w-full bg-transparent text-white outline-none"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        />
      </div>

      {/* Table */}
      <div
        className="overflow-x-auto bg-gray-900 rounded-lg p-4">
        {isLoading ? (
          <p className="text-center text-white">Loading User...</p>
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
        {/* Pagination control */}
        <div className="flex justify-between items-center text-white hover:bg-blue-700">
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>

      </div>
    </div>
  )
}

export default UsersPage;
// 2 : 10