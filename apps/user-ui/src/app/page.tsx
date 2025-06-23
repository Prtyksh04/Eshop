'use client'
import React from 'react'
import Hero from './shared/components/modules/Hero'
import SectionTitle from './shared/components/section/sectionTitle'
import { useQuery } from '@tanstack/react-query'
import axiosInstance from '../utils/axiosInstance'
import ProductCard from './shared/components/cards/ProductCard'
import ShopCard from './shared/components/cards/ShopCard'

const page = () => {

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: latestProducts, isLoading: LatestProductsLoading } = useQuery({
    queryKey: ['latest-products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10&type=latest');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: shops, isLoading: shopLoading } = useQuery({
    queryKey: ['shops'],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/top-shops");
      return res.data.shops;
    },
    staleTime: 1000 * 60 * 2,
  })

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const res = await axiosInstance.get("/product/api/get-all-events?page=1&limit=10");
      return res.data.events || [];
    },
    staleTime: 1000 * 60 * 2,
  })

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
          {products?.length === 0 && (
            <p className='text-center'>
              No Products Available
            </p>
          )}

          {isLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {Array.from({ length: 10 }).map((_, index) => (
                <div
                  key={index}
                  className='h-[250px] bg-gray-300 animate-pulse rounded-xl'
                >

                </div>
              ))}
            </div>
          )}
          <div className='my-8 block'>
            <SectionTitle
              title='Latest Products'
            />
          </div>
          {!LatestProductsLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {latestProducts?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!LatestProductsLoading && latestProducts.length === 0 && (
            <p className='text-center'>
              No Product Available yet
            </p>
          )}
          <div className='my-8 block'>
            <SectionTitle
              title='Top Shops'
            />
          </div>
          {!shopLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {shops?.map((shop: any) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}
          {!shopLoading &&  shops.length === 0 && (
            <p className='text-center'>
              No Shops Available yet
            </p>
          )}
          <div className='my-8 block'>
            <SectionTitle
              title='Top offers'
            />
          </div>
          {!offersLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4'>
              {offers?.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!offersLoading && offers.length === 0 && (
            <p className='text-center'>
              No Offers Available yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default page