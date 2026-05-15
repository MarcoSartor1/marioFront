'use server';

import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';

export interface XubioAjusteStock {
  numeroDocumento: string;
  nombre: string;
  fecha: string;
}

export interface XubioListaPrecio {
  listaPrecioID: number;
  nombre: string;
  esDefault: boolean;
}

export const getXubioConfigData = async (): Promise<{
  ajustesStock: XubioAjusteStock[];
  listasPrecio: XubioListaPrecio[];
}> => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ajustesStock: [], listasPrecio: [] };
  }

  const [ajustesResp, listasResp] = await Promise.allSettled([
    apiFetch('/xubio/ajustes-stock'),
    apiFetch('/xubio/listas-precio'),
  ]);

  const ajustesStock: XubioAjusteStock[] =
    ajustesResp.status === 'fulfilled' && ajustesResp.value.ok
      ? await ajustesResp.value.json().catch(() => [])
      : [];

  const listasPrecio: XubioListaPrecio[] =
    listasResp.status === 'fulfilled' && listasResp.value.ok
      ? await listasResp.value.json().catch(() => [])
      : [];

  return { ajustesStock, listasPrecio };
};
