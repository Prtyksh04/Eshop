'use client'

import React, { useMemo, useState, useDeferredValue } from "react"

import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    flexRender
} from "@tanstack/react-table"

import { Download, Ban, Search } from "lucide-react"
import { useQuery, useMutation, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { saveAs } from "file-saver"
import axiosInstance from "apps/admin-ui/src/utils/axiosInstance"

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
  return (
    <div>
        
    </div>
  )
}

export default UsersPage