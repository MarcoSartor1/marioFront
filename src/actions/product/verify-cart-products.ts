'use server';

interface CartItemInput {
  id: string;
  slug: string;
  title: string;
  price: number;
  quantity: number;
}

export interface PriceChangeIssue {
  productId: string;
  slug: string;
  title: string;
  oldPrice: number;
  newPrice: number;
}

export interface StockIssue {
  productId: string;
  slug: string;
  title: string;
  available: number;
  requested: number;
}

export interface VerifyCartResult {
  ok: boolean;
  priceChanges: PriceChangeIssue[];
  stockIssues: StockIssue[];
}

export const verifyCartProducts = async (
  cartItems: CartItemInput[]
): Promise<VerifyCartResult> => {
  try {
    // Group by productId — sum quantities across sizes, price is the same per product
    const byProduct = new Map<
      string,
      { slug: string; title: string; price: number; totalQty: number }
    >();

    for (const item of cartItems) {
      const existing = byProduct.get(item.id);
      if (existing) {
        existing.totalQty += item.quantity;
      } else {
        byProduct.set(item.id, {
          slug: item.slug,
          title: item.title,
          price: item.price,
          totalQty: item.quantity,
        });
      }
    }

    const priceChanges: PriceChangeIssue[] = [];
    const stockIssues: StockIssue[] = [];

    await Promise.all(
      Array.from(byProduct.entries()).map(async ([productId, cartData]) => {
        try {
          const resp = await fetch(
            `${process.env.API_URL}/products/${cartData.slug}`,
            { cache: 'no-store' }
          );
          if (!resp.ok) return;

          const product = await resp.json();

          if (product.price !== cartData.price) {
            priceChanges.push({
              productId,
              slug: cartData.slug,
              title: cartData.title,
              oldPrice: cartData.price,
              newPrice: product.price,
            });
          }

          if (product.stock < cartData.totalQty) {
            stockIssues.push({
              productId,
              slug: cartData.slug,
              title: cartData.title,
              available: product.stock,
              requested: cartData.totalQty,
            });
          }
        } catch {
          // Can't reach backend for this product — skip, backend will validate on order placement
        }
      })
    );

    return {
      ok: priceChanges.length === 0 && stockIssues.length === 0,
      priceChanges,
      stockIssues,
    };
  } catch (error) {
    console.error('[verifyCartProducts] error:', error);
    // On unexpected error allow order to proceed — backend validates too
    return { ok: true, priceChanges: [], stockIssues: [] };
  }
};
