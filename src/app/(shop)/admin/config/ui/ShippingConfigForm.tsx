'use client';

import { useState } from 'react';
import { updateShippingConfig } from '@/actions';

interface Props {
  shippingCostSucursal: number;
  shippingCostDomicilio: number;
  freeShippingCities: string;
}

export const ShippingConfigForm = ({ shippingCostSucursal, shippingCostDomicilio, freeShippingCities }: Props) => {
  const [sucursal, setSucursal] = useState(String(shippingCostSucursal));
  const [domicilio, setDomicilio] = useState(String(shippingCostDomicilio));
  const [cities, setCities] = useState(freeShippingCities);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    const result = await updateShippingConfig({
      shippingCostSucursal: Number(sucursal) || 0,
      shippingCostDomicilio: Number(domicilio) || 0,
      freeShippingCities: cities.trim(),
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Costo envío a sucursal ($)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            className="p-2 border rounded-md bg-gray-100 w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Costo envío a domicilio ($)
          </label>
          <input
            type="number"
            min="0"
            step="1"
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            className="p-2 border rounded-md bg-gray-100 w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Ciudades con envío gratis
        </label>
        <input
          type="text"
          value={cities}
          onChange={(e) => setCities(e.target.value)}
          placeholder="reconquista:santa fe,avellaneda:santa fe"
          className="p-2 border rounded-md bg-gray-100 w-full"
        />
        <p className="text-xs text-gray-500 mt-1">
          Formato: <span className="font-mono">ciudad:provincia</span>, separadas por coma, sin tildes ni mayúsculas.
          Ej: <span className="font-mono">reconquista:santa fe,avellaneda:santa fe</span>
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
