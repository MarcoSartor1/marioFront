'use client';

import { useRef, useState, useTransition } from 'react';
import Image from 'next/image';
import { updateLogoConfig, removeStoreLogo } from '@/actions';

interface Props {
  currentLogoUrl: string | null;
  showTitleWithLogo: boolean;
}

export const LogoUploader = ({ currentLogoUrl, showTitleWithLogo: initial }: Props) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [showTitle, setShowTitle] = useState(initial);
  const [logoUrl, setLogoUrl] = useState(currentLogoUrl);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1024 * 1024) {
      setError('El archivo supera 1 MB. Elegí una imagen más pequeña.');
      e.target.value = '';
      return;
    }
    setError(null);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    formData.set('showTitleWithLogo', String(showTitle));

    startTransition(async () => {
      const result = await updateLogoConfig(formData);
      if (result.ok) {
        setSuccess(true);
        if (preview) setLogoUrl(preview);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
      } else {
        setError(result.message ?? 'Error al guardar');
      }
    });
  };

  const handleRemoveLogo = () => {
    startTransition(async () => {
      setError(null);
      const result = await removeStoreLogo();
      if (result.ok) {
        setLogoUrl(null);
        setPreview(null);
        if (fileRef.current) fileRef.current.value = '';
      } else {
        setError(result.message ?? 'Error al eliminar');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Vista previa actual */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Logo actual</p>
        {logoUrl ? (
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-48 border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              <Image
                src={preview ?? logoUrl}
                alt="Logo de la tienda"
                fill
                className="object-contain p-2"
                unoptimized
              />
            </div>
            <button
              type="button"
              onClick={handleRemoveLogo}
              disabled={isPending}
              className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50"
            >
              Quitar logo
            </button>
          </div>
        ) : (
          <div className="h-16 w-48 border border-dashed border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
            <span className="text-xs text-gray-400">Sin logo</span>
          </div>
        )}
      </div>

      {/* Upload */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-1">
          {logoUrl ? 'Reemplazar logo' : 'Subir logo'}
        </label>
        <p className="text-xs text-gray-400 mb-3">
          PNG, JPG o SVG &mdash; fondo transparente recomendado &mdash; mínimo 200&nbsp;px de ancho,
          máximo 800&nbsp;px &mdash; relación 3:1 o 4:1 (ej. 400&times;120&nbsp;px) &mdash; menos de 1&nbsp;MB
        </p>
        <input
          ref={fileRef}
          type="file"
          name="logo"
          accept="image/png,image/jpeg,image/svg+xml,image/webp"
          onChange={handleFileChange}
          className="block text-sm text-gray-600
            file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
            file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700
            hover:file:bg-gray-200 cursor-pointer"
        />

        {preview && (
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1">Vista previa:</p>
            <div className="relative h-16 w-48 border border-blue-200 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
            </div>
          </div>
        )}
      </div>

      {/* Modo de visualización */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Mostrar en el menú</p>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="displayMode"
              checked={!showTitle}
              onChange={() => setShowTitle(false)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Solo logo</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="displayMode"
              checked={showTitle}
              onChange={() => setShowTitle(true)}
              className="accent-blue-600"
            />
            <span className="text-sm text-gray-700">Logo y nombre de la tienda</span>
          </label>
        </div>
        {!logoUrl && !preview && (
          <p className="text-xs text-gray-400 mt-2">
            Esta opción aplica cuando hay un logo cargado.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">Logo actualizado correctamente.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : 'Guardar'}
      </button>
    </form>
  );
};
