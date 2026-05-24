'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Clock3, Sparkles, Store, Tag } from 'lucide-react';
import Link from 'next/link';
import axiosInstance from '../utils/axiosInstance';
import Hero from './shared/components/modules/Hero';
import ProductCard from './shared/components/cards/ProductCard';
import ShopCard from './shared/components/cards/ShopCard';
import SectionTitle from './shared/components/section/sectionTitle';

const sectionShell =
  'rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-sm p-5 md:p-6 shadow-sm';

const SkeletonGrid = ({ count = 8 }: { count?: number }) => (
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4'>
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={index}
        className='h-[300px] rounded-xl border border-slate-200 bg-gradient-to-b from-slate-200 to-slate-100 animate-pulse'
      />
    ))}
  </div>
);

const Page = () => {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-products?page=1&limit=10');
      return res.data.products;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: latestProducts, isLoading: latestProductsLoading } = useQuery({
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
      const res = await axiosInstance.get('/product/api/top-shops');
      return res.data.shops;
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: offers, isLoading: offersLoading } = useQuery({
    queryKey: ['offers'],
    queryFn: async () => {
      const res = await axiosInstance.get('/product/api/get-all-events?page=1&limit=10');
      return res.data.events || [];
    },
    staleTime: 1000 * 60 * 2,
  });

  const suggestedProducts = products ?? [];
  const latestList = latestProducts ?? [];
  const topShops = shops ?? [];
  const offerList = offers ?? [];

  return (
    <div className='bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#f8fafc_30%,_#f8fafc_100%)]'>
      <Hero />

      <div className='md:w-[84%] w-[92%] my-10 md:my-14 mx-auto space-y-8 md:space-y-10'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='rounded-2xl bg-slate-900 text-slate-50 p-5 shadow-lg'>
            <p className='text-xs uppercase tracking-[0.14em] text-slate-300'>Curated Picks</p>
            <h2 className='text-2xl font-bold mt-2'>{suggestedProducts.length}+ Ready to Explore</h2>
            <p className='text-sm text-slate-300 mt-1'>Fresh finds chosen from trending categories.</p>
          </div>

          <div className='rounded-2xl bg-white border border-slate-200 p-5 shadow-sm'>
            <div className='w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center mb-3'>
              <Store size={18} />
            </div>
            <h3 className='font-semibold text-slate-900'>Trusted Shops</h3>
            <p className='text-sm text-slate-600 mt-1'>{topShops.length} top-rated sellers this week.</p>
          </div>

          <div className='rounded-2xl bg-white border border-slate-200 p-5 shadow-sm'>
            <div className='w-10 h-10 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center mb-3'>
              <Tag size={18} />
            </div>
            <h3 className='font-semibold text-slate-900'>Live Offers</h3>
            <p className='text-sm text-slate-600 mt-1'>{offerList.length} active deals with limited windows.</p>
          </div>
        </div>

        <section className={sectionShell}>
          <div className='flex items-center justify-between gap-4'>
            <SectionTitle title='Suggested Products' />
            <span className='hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full'>
              <Sparkles size={14} /> Best Matches
            </span>
          </div>

          {isLoading && <SkeletonGrid count={10} />}

          {!isLoading && !isError && (
            <div className='grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 2xl:grid-cols-5 gap-5 mt-4'>
              {suggestedProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && suggestedProducts.length === 0 && (
            <p className='text-center text-slate-500 mt-5'>No products available.</p>
          )}
        </section>

        <section className={sectionShell}>
          <div className='flex items-center justify-between gap-4'>
            <SectionTitle title='Latest Products' />
            <span className='inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full'>
              <Clock3 size={14} /> Just In
            </span>
          </div>

          {latestProductsLoading && <SkeletonGrid count={8} />}

          {!latestProductsLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4'>
              {latestList.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!latestProductsLoading && latestList.length === 0 && (
            <p className='text-center text-slate-500 mt-5'>No latest products available yet.</p>
          )}
        </section>

        <section className={sectionShell}>
          <div className='flex items-center justify-between gap-4'>
            <SectionTitle title='Top Shops' />
            <span className='text-xs font-semibold text-slate-500'>{topShops.length} featured shops</span>
          </div>

          {shopLoading && <SkeletonGrid count={8} />}

          {!shopLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4'>
              {topShops.map((shop: any) => (
                <ShopCard key={shop.id} shop={shop} />
              ))}
            </div>
          )}

          {!shopLoading && topShops.length === 0 && (
            <p className='text-center text-slate-500 mt-5'>No shops available yet.</p>
          )}
        </section>

        <section className={sectionShell}>
          <div className='flex items-center justify-between gap-4'>
            <SectionTitle title='Top Offers' />
            <span className='text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full'>
              Limited Time
            </span>
          </div>

          {offersLoading && <SkeletonGrid count={8} />}

          {!offersLoading && (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4'>
              {offerList.map((product: any) => (
                <ProductCard key={product.id} product={product} isEvent />
              ))}
            </div>
          )}

          {!offersLoading && offerList.length === 0 && (
            <p className='text-center text-slate-500 mt-5'>No offers available yet.</p>
          )}
        </section>

        <div className='rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 text-white shadow-lg'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div>
              <h3 className='text-xl md:text-2xl font-bold'>Discover more from curated categories</h3>
              <p className='text-slate-300 mt-1 text-sm md:text-base'>
                Keep exploring fresh drops, trusted sellers, and event-based pricing.
              </p>
            </div>
            <Link
              href='/products'
              className='inline-flex items-center gap-2 w-fit bg-white text-slate-900 font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition'
            >
              Browse all products
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
