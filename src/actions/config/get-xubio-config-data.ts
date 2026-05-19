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

export interface XubioDeposito {
  id: number;
  nombre: string;
  codigo: string;
}

export const getXubioConfigData = async (): Promise<{
  ajustesStock: XubioAjusteStock[];
  listasPrecio: XubioListaPrecio[];
  depositos: XubioDeposito[];
}> => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ajustesStock: [], listasPrecio: [], depositos: [] };
  }

  const [ajustesResp, listasResp, depositosResp] = await Promise.allSettled([
    apiFetch('/xubio/ajustes-stock'),
    apiFetch('/xubio/listas-precio'),
    apiFetch('/xubio/depositos'),
  ]);

  const ajustesStock: XubioAjusteStock[] =
    ajustesResp.status === 'fulfilled' && ajustesResp.value.ok
      ? await ajustesResp.value.json().catch(() => [])
      : [];

  const listasPrecio: XubioListaPrecio[] =
    listasResp.status === 'fulfilled' && listasResp.value.ok
      ? await listasResp.value.json().catch(() => [])
      : [];

  const depositos: XubioDeposito[] =
    depositosResp.status === 'fulfilled' && depositosResp.value.ok
      ? await depositosResp.value.json().catch(() => [])
      : [];

  return { ajustesStock, listasPrecio, depositos };
};
