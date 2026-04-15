'use server';

import { apiGet } from '@/lib/api';
import type { AdminProduct } from '@/interfaces';

interface AdminProductsResponse {
  data: AdminProduct[];
  total: number;
}

interface Options {
  page?: number;
  take?: number;
}

export const getAdminProducts = async ({ page = 1, take = 12 }: Options = {}) => {
  const offset = (page - 1) * take;

  try {
    const { data, total } = await apiGet<AdminProductsResponse>(
      `/products/admin?limit=${take}&offset=${offset}`,
    );

    return {
      ok: true,
      products: data,
      currentPage: page,
      totalPages: Math.ceil(total / take),
    };
  } catch (error) {
    return { ok: false, products: [] as AdminProduct[], currentPage: page, totalPages: 0 };
  }
};
