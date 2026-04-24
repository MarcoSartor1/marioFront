"use client";

import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";

interface Props {
  initialQuery?: string;
}

export const SearchInput = ({ initialQuery = "" }: Props) => {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xl mb-8">
      <IoSearchOutline
        size={20}
        className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
      />
      <input
        autoFocus
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="w-full bg-gray-50 rounded-lg pl-10 py-3 pr-4 border border-gray-200 focus:outline-none focus:border-blue-500 text-base"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-blue-600 font-medium hover:text-blue-800"
      >
        Buscar
      </button>
    </form>
  );
};
