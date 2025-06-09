'use client'
import { MoveRight } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation'
import React from 'react'

const Hero = () => {

    const router = useRouter();

    return (
        <div className='bg-[#115061] h-[85vh] flex flex-col justify-center w-full'>
            <div className='md:w-[80%] w-[90%] m-auto md:flex h-full items-center'>
                <div className='md:w-1/2'>
                    <p className='font-normal text-white pb-2 text-xl'>
                        Starting from 499 INR
                    </p>
                    <h1 className='text-white text-6xl font-extrabold'>
                        The best watch <br />
                        Collection 2025
                    </h1>
                    <p className='text-3xl pt-4 text-white'>
                        Exclusive offer <span className='text-yellow-400'>10%</span>
                        {" "}this week
                    </p>
                    <br />
                    <button
                        onClick={() => router.push("/products")}
                        className='w-[140px] gap-2 font-semibold h-[40px] hover:text-yellow-600 text-yellow-400 flex gap-4'
                    >
                        Shop Now
                        <MoveRight />
                    </button>
                </div>
                <div className='md:w-1/2'>
                    <Image
                        alt=''
                        src={'https://ik.imagekit.io/pratyaksh/products/watch.png?updatedAt=1748449614783'}
                         width={450}
                        height={450}
                        className='object-contain'
                    />
                </div>
            </div>
        </div>
    )
}

export default Hero