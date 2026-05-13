'use server';

interface NestProductVariant {
  id: string;
  color: string;
  inStock: number;
  stock?: number;
}

interface NestProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  slug: string;
  stock: number;
  sizes: string[];
  colors: string[];
  variants: NestProductVariant[];
  gender: string;
  tags: string[];
  categoryId?: string;
  images: string[];
}

export const getProductBySlug = async (slug: string) => {
  try {
    const resp = await fetch(`${process.env.API_URL}/products/${slug}`, {
      cache: 'no-store',
    });

    if (resp.status === 404) return null;
    if (!resp.ok) throw new Error('Error al obtener producto por slug');

    const product: NestProduct = await resp.json();

    let variants = (product.variants ?? []).map(v => ({
      ...v,
      inStock: v.inStock ?? v.stock ?? 0,
    }));

    // The slug endpoint may not return variants — fall back to the list endpoint
    if (variants.length === 0) {
      try {
        const listResp = await fetch(
          `${process.env.API_URL}/products?search=${encodeURIComponent(product.slug)}&limit=5`,
          { cache: 'no-store' },
        );
        if (listResp.ok) {
          const { data } = await listResp.json();
          const match = (data as NestProduct[]).find(p => p.slug === product.slug);
          if (match?.variants?.length) {
            variants = match.variants.map(v => ({
              ...v,
              inStock: v.inStock ?? v.stock ?? 0,
            }));
          }
        }
      } catch {
        // fallback failed — continue without variant stock
      }
    }

    return {
      ...product,
      inStock: product.stock,
      variants,
      images: product.images ?? [],
      ProductImage: (product.images ?? []).map((url, index) => ({
        id: index,
        url,
        productId: product.id,
      })),
    };
  } catch (error) {
    console.log(error);
    throw new Error('Error al obtener producto por slug');
  }
};
