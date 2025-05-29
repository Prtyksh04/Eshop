'use client';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { navItems } from '../../../../configs/constants';
import { AlignLeft, ChevronDown, HeartIcon, ShoppingCart, UserRoundPenIcon } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const HeaderBottom = () => {
    const [show, setShow] = useState(false);
    const [isSticky, setIsSticky] = useState(false);

    const { user, isLoading } = useUser();


    useEffect(() => {
        const handleScroll = () => {
            setIsSticky(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            className={`w-full transition-all duration-300 ease-in-out ${isSticky ? 'fixed top-0 left-0 z-50 bg-white shadow-md' : 'relative'
                }`}
        >
            <div
                className={`w-[80%] m-auto flex items-center justify-between ${isSticky ? 'py-3' : 'py-2'
                    } transition-all duration-300 ease-in-out`}
            >
                {/* All Categories Dropdown Toggle */}
                <div className='relative'>
                    <div
                        className={`w-[260px] cursor-pointer flex items-center justify-between h-[50px] bg-[#3489FF] px-5 ${isSticky && '-mb-2'
                            }`}
                        onClick={() => setShow(!show)}
                    >
                        <div className="flex items-center gap-2">
                            <AlignLeft color="#fff" />
                            <span className="text-white font-medium">All Categories</span>
                        </div>
                        <ChevronDown color="#fff" />
                    </div>
                    {/* Dropdown Menu */}
                    {show && (
                        <div
                            className={`absolute left-0 ${isSticky ? 'top-[70px]' : 'top-[50px]'
                                } w-[260px] h-[400px] bg-[#f5f5f5] z-40`}
                        >
                            {/* Dropdown content goes here */}
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="flex items-center gap-5">
                    {navItems.map((i: NavItemsTypes, index: number) => (
                        <Link
                            key={index}
                            className="text-[17px] font-medium hover:text-[#3489FF] transition"
                            href={i.href}
                        >
                            {i.title}
                        </Link>
                    ))}
                </div>

                {/* Right Icons - Only visible in sticky */}
                {isSticky && (
                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-2">
                            {!isLoading && user ? (
                                <>
                                    <Link href={'/profile'}
                                        className="border-2 border-[#010f1c1a] w-[50px] h-[50px] flex items-center justify-center rounded-full"
                                    >
                                        <UserRoundPenIcon />
                                    </Link>
                                    <Link href="/profile" className="flex flex-col">
                                        <span className="text-sm font-medium">Hello,</span>
                                        <span className="font-semibold">{user?.name?.split(" ")[0]}</span>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="border-2 border-[#010f1c1a] w-[50px] h-[50px] flex items-center justify-center rounded-full"
                                    >
                                        <UserRoundPenIcon />
                                    </Link>
                                    <Link href="/login" className="flex flex-col">
                                        <span className="text-sm font-medium">Hello,</span>
                                        <span className="font-semibold">{isLoading ? "..." : "Sign In"}</span>
                                    </Link>
                                </>
                            )}
                        </div>
                        <Link href="/wishlist" className="relative">
                            <HeartIcon />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                                0
                            </div>
                        </Link>
                        <Link href="/cart" className="relative">
                            <ShoppingCart />
                            <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                                0
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HeaderBottom;
