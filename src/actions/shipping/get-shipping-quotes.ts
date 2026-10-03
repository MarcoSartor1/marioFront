'use server';
import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';
import type { ShippingQuote } from '@/interfaces/shipping.interface';

export async function getShippingQuotes(input: {
  items: { productId: string; variantId?: string; size?: string; quantity: number }[];
  destination: { city: string; province: string; postalCode: string };
}): Promise<{ ok: true; quote: ShippingQuote } | { ok: false; message: string }> {
  if (!(await auth())?.user) return { ok: false, message: 'Ingresá a tu cuenta para calcular el envío.' };
  try {
    const response = await apiFetch('/shipping/quotes', { method: 'POST', body: JSON.stringify(input), cache: 'no-store' });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      return { ok: false, message: response.status === 429 ? 'Esperá unos segundos antes de volver a calcular.' : typeof error.message === 'string' ? error.message : 'Revisá el destino y los productos para calcular el envío.' };
    }
    return { ok: true, quote: await response.json() };
  } catch {
    return { ok: false, message: 'No pudimos calcular el envío. Intentá nuevamente.' };
  }
}
