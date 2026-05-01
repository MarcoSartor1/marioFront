'use server';

const API_URL = process.env.API_URL!;

interface Country {
  id: string;
  name: string;
}

export const getCountries = async (): Promise<Country[]> => {
  try {
    const resp = await fetch(`${API_URL}/countries`, { cache: 'no-store' });
    if (!resp.ok) throw new Error(`GET /countries → ${resp.status}`);
    const data = await resp.json();
    const list = Array.isArray(data) ? data : (data as any)?.data ?? [];
    return list as Country[];
  } catch (error) {
    console.error('[getCountries] Error al obtener países:', error);
    return [];
  }
};
