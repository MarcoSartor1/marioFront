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
  showTitleWithLogo: boolean;
  categories: Category[];
  isContactPagePublished: boolean;
}

export const TopMenu = ({ storeName, logoUrl, showTitleWithLogo, categories, isContactPagePublished }: Props) => {

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
    <nav className="sticky top-0 z-30 w-full bg-[#FDFAF5] border-b border-amber-100 shadow-sm">
      {/* Fila 1: logo centrado + búsqueda/carrito/menú */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-3 sm:py-4">
        <div />

        <Link href="/" className="flex items-center justify-center gap-3 justify-self-center">
          {logoUrl ? (
            <>
              <Image
                src={logoUrl}
                alt={storeName}
                width={260}
                height={80}
                className="object-contain h-14 sm:h-20 w-auto"
                priority
              />
              {showTitleWithLogo && (
                <span className={`${titleFont.className} antialiased font-bold text-lg sm:text-xl hidden sm:inline`}>
                  {storeName}
                </span>
              )}
            </>
          ) : (
            <>
              <span className={`${titleFont.className} antialiased font-bold text-2xl sm:text-3xl`}>
                {storeName.split('|')[0].trim()}
              </span>
              {storeName.includes('|') && (
                <span> | {storeName.split('|')[1].trim()}</span>
              )}
            </>
          )}
        </Link>

        <div className="flex items-center justify-end justify-self-end">
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
                <span className="fade-in absolute text-xs px-1 rounded-full font-bold -top-2 -right-2 bg-primary text-white">
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
      </div>

      {/* Fila 2: navegación centrada */}
      <div
        className="relative hidden sm:flex justify-center items-center gap-2 border-t border-amber-100 py-2"
        ref={dropdownRef}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <div onMouseEnter={() => setShowDropdown(true)}>
          <Link
            href="/"
            className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
            onClick={() => setShowDropdown(false)}
          >
            Productos
          </Link>
        </div>

        {isContactPagePublished && (
          <Link href="/contact" className="m-2 p-2 rounded-md transition-all hover:bg-gray-100">
            Contacto
          </Link>
        )}

        {showDropdown && categories.length > 0 && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-[#FDFAF5] border border-amber-100 shadow-lg rounded-md p-3 z-50 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 w-max max-w-[90vw]">
            {[...categories].sort((a, b) => a.name.localeCompare(b.name, 'es')).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.name}`}
                className="block px-2 py-1.5 text-sm rounded hover:bg-gray-100 transition-colors capitalize whitespace-nowrap"
                onClick={() => setShowDropdown(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
