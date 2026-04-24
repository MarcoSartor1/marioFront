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
  search?: string;
  sortByStock?: string;
  status?: string;
}

export const getAdminProducts = async ({
  page = 1,
  take = 12,
  search,
  sortByStock,
  status,
}: Options = {}) => {
  const offset = (page - 1) * take;

  const params = new URLSearchParams({ limit: String(take), offset: String(offset) });
  if (search) params.set('search', search);
  if (sortByStock) params.set('sortByStock', sortByStock);
  if (status && status !== 'all') params.set('status', status);

  try {
    const { data, total } = await apiGet<AdminProductsResponse>(
      `/products/admin?${params.toString()}`,
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
