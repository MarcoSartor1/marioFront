'use server';

import { Gender } from '@prisma/client';

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

interface PaginationOptions {
  page?: number;
  take?: number;
  gender?: Gender;
  category?: string;
}

export const getPaginatedProductsWithImages = async ({
  page = 1,
  take = 12,
  gender,
  category,
}: PaginationOptions) => {
  if (isNaN(Number(page))) page = 1;
  if (page < 1) page = 1;

  const offset = (page - 1) * take;

  const params = new URLSearchParams({
    limit: String(take),
    offset: String(offset),
    ...(gender ? { gender } : {}),
    ...(category ? { category } : {}),
  });

  try {
    const resp = await fetch(`${process.env.API_URL}/products?${params}`, {
      cache: 'no-store',
    });

    if (!resp.ok) throw new Error('No se pudo cargar los productos');

    const { data, total }: { data: NestProduct[]; total: number } = await resp.json();

    const totalPages = Math.ceil(total / take);

    return {
      currentPage: page,
      totalPages,
      products: data.map((product) => ({
        ...product,
        inStock: product.stock,
      })),
    };
  } catch (error) {
    return { currentPage: page, totalPages: 0, products: [] };
  }
};
