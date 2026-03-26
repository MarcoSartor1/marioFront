'use server';

import { apiGet } from '@/lib/api';

export const getUserAddress = async (_userId: string) => {
  try {
    const address = await apiGet<any>('/addresses');
    if (!address) return null;

    const { countryId, address2, ...rest } = address;

    return {
      ...rest,
      country: countryId,
      address2: address2 ? address2 : '',
    };
  } catch (error) {
    console.log(error);
    return null;
  }
};
