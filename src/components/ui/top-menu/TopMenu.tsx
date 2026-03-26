"use client";
import { useEffect, useRef, useState } from 'react';

import Link from "next/link";
import Image from "next/image";
import { IoSearchOutline, IoCartOutline } from "react-icons/io5";

import { titleFont } from "@/config/fonts";
import { useCartStore, useUIStore } from "@/store";

interface Category {
  id: string;
  name: string;
}

interface Props {
  storeName: string;
  logoUrl: string | null;
  categories: Category[];
}

export const TopMenu = ({ storeName, logoUrl, categories }: Props) => {

  const openSideMenu = useUIStore((state) => state.openSideMenu);
  const totalItemsInCart = useCartStore((state) => state.getTotalItems());

  const [loaded, setLoaded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex px-5 justify-between items-center w-full">
      {/* Logo */}
      <div>
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={storeName}
              width={120}
              height={40}
              className="object-contain"
              priority
            />
          ) : (
            <>
              <span className={`${titleFont.className} antialiased font-bold`}>
                {storeName.split('|')[0].trim()}
              </span>
              {storeName.includes('|') && (
                <span> | {storeName.split('|')[1].trim()}</span>
              )}
            </>
          )}
        </Link>
      </div>

      {/* Center Menu */}
      <div className="hidden sm:block" ref={dropdownRef}>
        <div
          className="relative inline-block"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          <Link
            href="/"
            className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
            onClick={() => setShowDropdown(false)}
          >
            Productos
          </Link>

          {showDropdown && categories.length > 0 && (
            <div className="absolute top-full left-0 mt-1 bg-white shadow-lg rounded-md py-1 z-50 min-w-[160px]">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.name}`}
                  className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors capitalize"
                  onClick={() => setShowDropdown(false)}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Search, Cart, Menu */}
      <div className="flex items-center">
        <Link href="/search" className="mx-2">
          <IoSearchOutline className="w-5 h-5" />
        </Link>

        <Link href={
          ((totalItemsInCart === 0) && loaded)
            ? '/empty'
            : "/cart"
        } className="mx-2">
          <div className="relative">
            {(loaded && totalItemsInCart > 0) && (
              <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-blue-700 text-white">
                {totalItemsInCart}
              </span>
            )}
            <IoCartOutline className="w-5 h-5" />
          </div>
        </Link>

        <button
          onClick={openSideMenu}
          className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
        >
          Menú
        </button>
      </div>
    </nav>
  );
};
