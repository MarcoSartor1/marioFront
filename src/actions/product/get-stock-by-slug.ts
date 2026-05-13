'use server';

export const getStockBySlug = async (slug: string): Promise<number> => {
  try {
    const resp = await fetch(`${process.env.API_URL}/products/${slug}`, {
      cache: 'no-store',
    });

    if (!resp.ok) return 0;

    const product = await resp.json();

    let variants: any[] = product.variants ?? [];

    if (variants.length === 0) {
      try {
        const listResp = await fetch(
          `${process.env.API_URL}/products?search=${encodeURIComponent(slug)}&limit=5`,
          { cache: 'no-store' },
        );
        if (listResp.ok) {
          const { data } = await listResp.json();
          const match = (data as any[]).find((p: any) => p.slug === slug);
          if (match?.variants?.length) variants = match.variants;
        }
      } catch {
        // ignore
      }
    }

    if (variants.length > 0) {
      return variants.reduce((sum: number, v: any) => sum + (v.inStock ?? v.stock ?? 0), 0);
    }
    return product.stock ?? 0;
  } catch (error) {
    return 0;
  }
};
