'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { IoSearchOutline, IoCloseOutline } from 'react-icons/io5';

export const HomeSearchInput = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('q') ?? '');
  const isMount = useRef(true);

  useEffect(() => {
    if (isMount.current) {
      isMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const trimmed = value.trim();
      if (trimmed) {
        router.replace(`/?q=${encodeURIComponent(trimmed)}&page=1`);
      } else {
        router.replace('/');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [value, router]);

  return (
    <div className="relative w-full max-w-xl mx-auto mb-6">
      <IoSearchOutline
        size={18}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full bg-gray-50 rounded-lg pl-9 py-2.5 pr-10 border border-gray-200 focus:outline-none focus:border-blue-500 text-sm"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <IoCloseOutline size={18} />
        </button>
      )}
    </div>
  );
};
