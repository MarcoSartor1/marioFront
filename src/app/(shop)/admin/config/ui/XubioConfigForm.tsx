'use client';

import { useState } from 'react';
import { updateXubioConfig } from '@/actions';
import type { XubioAjusteStock, XubioListaPrecio } from '@/actions';

interface Props {
  ajustesStock: XubioAjusteStock[];
  listasPrecio: XubioListaPrecio[];
  initialStockAdjustmentDoc: string | null;
  initialListaPrecioId: number | null;
}

export const XubioConfigForm = ({
  ajustesStock,
  listasPrecio,
  initialStockAdjustmentDoc,
  initialListaPrecioId,
}: Props) => {
  const [stockDoc, setStockDoc] = useState(initialStockAdjustmentDoc ?? '');
  const [listaPrecioId, setListaPrecioId] = useState(
    initialListaPrecioId != null ? String(initialListaPrecioId) : '',
  );
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const result = await updateXubioConfig({
      xubioStockAdjustmentDoc: stockDoc || null,
      xubioListaPrecioId: listaPrecioId ? Number(listaPrecioId) : null,
    });

    setSaving(false);

    if (!result.ok) {
      setErrorMsg(result.message ?? 'Error al guardar');
      return;
    }

    setSuccessMsg('Configuración guardada correctamente');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Ajuste de stock activo
        </label>
        <select
          value={stockDoc}
          onChange={(e) => setStockDoc(e.target.value)}
          className="p-2 border rounded-md bg-gray-100 w-full"
        >
          <option value="">— Sin seleccionar —</option>
          {ajustesStock.map((a) => (
            <option key={a.numeroDocumento} value={a.numeroDocumento}>
              N° {a.numeroDocumento} — {a.nombre} ({a.fecha})
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          El sync se ejecuta cuando existe un ajuste con número mayor al seleccionado.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Lista de precios
        </label>
        <select
          value={listaPrecioId}
          onChange={(e) => setListaPrecioId(e.target.value)}
          className="p-2 border rounded-md bg-gray-100 w-full"
        >
          <option value="">— Sin seleccionar —</option>
          {listasPrecio.map((l) => (
            <option key={l.listaPrecioID} value={String(l.listaPrecioID)}>
              {l.esDefault ? '★ ' : ''}{l.nombre}
            </option>
          ))}
        </select>
        <p className="text-xs text-gray-500 mt-1">
          Lista de precios de Xubio usada para sincronizar los precios de productos.
        </p>
      </div>

      {successMsg && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2">
          {successMsg}
        </p>
      )}
      {errorMsg && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2">
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={saving}
        className="btn-primary w-full sm:w-auto"
      >
        {saving ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </form>
  );
};
