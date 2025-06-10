'use client'
import React from 'react';
import Link from 'next/link';
import { HeartIcon, Search, ShoppingCart, UserRoundPenIcon } from 'lucide-react';
import HeaderBottom from './header-bottom';
import useUser from 'apps/user-ui/src/hooks/useUser';
import { useStore } from 'apps/user-ui/src/store';

const Header = () => {
    const { user, isLoading } = useUser();
    const wishlist = useStore((state: any) => state.wishlist);
    const cart = useStore((state: any) => state.cart);

    return (
        <div className="w-full bg-white">
            <div className="w-[80%] py-5 m-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/">
                    <span className="text-3xl font-semibold text-[#010F1C]">Ecom</span>
                </Link>

                {/* Search Bar */}
                <div className="w-[50%] relative">
                    <input
                        type="text"
                        className="w-full px-4 h-[55px] border-[2.5px] border-[#3489FF] outline-none font-medium"
                        placeholder="Search for products..."
                    />
                    <div className="absolute top-0 right-0 w-[60px] h-[55px] bg-[#3489FF] flex items-center justify-center cursor-pointer">
                        <Search color="#fff" />
                    </div>
                </div>

                {/* Icons */}
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
                            {wishlist.length}
                        </div>
                    </Link>
                    <Link href="/cart" className="relative">
                        <ShoppingCart />
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">
                            {cart.length}
                        </div>
                    </Link>
                </div>
            </div>

            <div className="border-b border-[#99999938]" />
            <HeaderBottom />
        </div>
    );
};

export default Header;
