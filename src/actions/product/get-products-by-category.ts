'use server';

import { apiGet } from '@/lib/api';

interface PaginationOptions {
  page?: number;
  take?: number;
  category: string;
}

interface NestProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  gender: string;
  tags: string[];
  images: string[];
}

export const getProductsByCategory = async ({
  page = 1,
  take = 12,
  category,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  const offset = (page - 1) * take;

  const params = new URLSearchParams({
    limit: String(take),
    offset: String(offset),
    category,
  });

  try {
    const { data, total } = await apiGet<{ data: NestProduct[]; total: number }>(
      `/products?${params}`,
    );

    return {
      currentPage: page,
      totalPages: Math.ceil(total / take),
      products: data.map((p) => ({
        ...p,
        inStock: p.stock,
      })),
    };
  } catch {
    return { currentPage: page, totalPages: 0, products: [] };
  }
};
