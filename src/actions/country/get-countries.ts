'use server';

import { apiGet } from '@/lib/api';

interface Country {
  id: string;
  name: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    return await apiGet<Country[]>('/countries');
  } catch (error) {
    console.log(error);
    return [];
  }
};
