'use server';

import { apiGet } from '@/lib/api';

interface Country {
  id: string;
  name: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    const data = await apiGet<unknown>('/countries');
    const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
    return list as Country[];
  } catch (error) {
    console.error('[getCountries] Error al obtener países:', error);
    return [];
  }
};
