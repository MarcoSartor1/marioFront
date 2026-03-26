'use server';

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

    return {
      ...product,
      inStock: product.stock,
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
