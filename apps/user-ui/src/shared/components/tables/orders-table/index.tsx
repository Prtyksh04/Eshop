'use client'

import React from "react"
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from "@tanstack/react-table"
import { useQuery } from "@tanstack/react-query"
import axiosInstance from "apps/user-ui/src/utils/axiosInstance"
import { useRouter } from "next/navigation"
import { ArrowUpRight } from "lucide-react"


