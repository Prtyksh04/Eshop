'use client'
import React from 'react'
import Hero from './shared/components/modules/Hero'
import SectionTitle from './shared/components/section/sectionTitle'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/axiosInstance'
import ProductCard from './shared/components/cards/ProductCard'

const page = () => {

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: latestProducts } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10&type=latest');
      console.log(res.data.products);
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  return (
    <div className='bg-[#f5f5f5]'>
      <Hero />
      <div className='md:w-[80%] w-[90%] my-10 m-auto'>
        <div className='mb-8'>
          <SectionTitle
            title='Suggested Product'
          />
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index}
                  className='h-[250px] bg-gray-300 animate-pulse rounded-xl mt-4'
                />
              ))}
            </div>
          )}
          {!isLoading && !isError && (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5">
              {
                products?.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default page