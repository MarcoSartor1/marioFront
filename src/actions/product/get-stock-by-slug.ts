'use server';

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const resp = await fetch(`${process.env.API_URL}/products/${slug}`, {
      cache: 'no-store',
    });

    if (!resp.ok) return 0;

    const product = await resp.json();
    return product.stock ?? 0;
  } catch (error) {
    return 0;
  }
};
