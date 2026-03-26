'use client';

import { useRef, useState } from 'react';
import { IoCloudUploadOutline, IoCheckmarkCircleOutline, IoWarningOutline } from 'react-icons/io5';

interface BulkUploadResult {
  created: number;
  failed: number;
  errors: string[];
}

export const BulkUploadForm = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<BulkUploadResult | null>(null);
  const [clientError, setClientError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setResult(null);
    setClientError(null);

    if (selected && !selected.name.endsWith('.zip')) {
      setClientError('El archivo debe ser un .zip');
      setFile(null);
      e.target.value = '';
      return;
    }

    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setClientError('Seleccioná un archivo .zip antes de continuar.');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setClientError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const resp = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        body: formData,
      });

      const data: BulkUploadResult = await resp.json();

      if (!resp.ok) {
        setClientError((data as any).message ?? 'Error al procesar la carga.');
        return;
      }

      setResult(data);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch {
      setClientError('Error de red. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl">
      {/* Drop zone / file input */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center cursor-pointer hover:border-blue-400 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <IoCloudUploadOutline size={48} className="mx-auto text-gray-400 mb-3" />
        {file ? (
          <p className="text-gray-700 font-medium">{file.name}</p>
        ) : (
          <>
            <p className="text-gray-500">Hacé clic para seleccionar un archivo</p>
            <p className="text-sm text-gray-400 mt-1">Solo archivos .zip</p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".zip"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Client-side error */}
      {clientError && (
        <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
          <IoWarningOutline size={16} />
          {clientError}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || !file}
        className="btn-primary mt-5 w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Procesando...
          </>
        ) : (
          'Cargar productos'
        )}
      </button>

      {/* Result */}
      {result && (
        <div className="mt-8 space-y-4">
          <div className="flex gap-6">
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-5 py-3">
              <IoCheckmarkCircleOutline size={22} />
              <div>
                <p className="text-2xl font-bold">{result.created}</p>
                <p className="text-xs">creados</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-5 py-3">
              <IoWarningOutline size={22} />
              <div>
                <p className="text-2xl font-bold">{result.failed}</p>
                <p className="text-xs">fallidos</p>
              </div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div>
              <p className="font-medium text-gray-700 mb-2">Errores a corregir:</p>
              <ul className="bg-red-50 border border-red-200 rounded-lg divide-y divide-red-100 text-sm text-red-800 max-h-64 overflow-y-auto">
                {result.errors.map((err, i) => (
                  <li key={i} className="px-4 py-2">
                    {err}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Format reference */}
      <details className="mt-8 text-sm text-gray-600">
        <summary className="cursor-pointer font-medium text-gray-700 hover:text-blue-600">
          Ver formato esperado del ZIP
        </summary>
        <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
          <div>
            <p className="font-medium mb-1">Estructura del ZIP:</p>
            <pre className="text-xs bg-gray-100 p-2 rounded">
{`upload.zip
├── products.xlsx   ← obligatorio
└── images/         ← opcional
    ├── producto1.jpg
    └── producto2.png`}
            </pre>
          </div>
          <div>
            <p className="font-medium mb-1">Columnas del Excel:</p>
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-2 py-1 text-left">Columna</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Requerido</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Ejemplo</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['title', '✅', 'Nike Air Max'],
                  ['price', 'no', '129.99'],
                  ['description', 'no', 'Zapatilla running...'],
                  ['inStock', 'no', '25'],
                  ['sizes', 'no', 'XS,S,M,L,XL'],
                  ['gender', 'no', 'men / women / kid / unisex'],
                  ['tags', 'no', 'nike,running'],
                  ['category', 'no', 'Shirts'],
                  ['images', 'no', 'nike1.jpg,nike2.jpg'],
                ].map(([col, req, ex]) => (
                  <tr key={col} className="odd:bg-white even:bg-gray-50">
                    <td className="border border-gray-300 px-2 py-1 font-mono">{col}</td>
                    <td className="border border-gray-300 px-2 py-1">{req}</td>
                    <td className="border border-gray-300 px-2 py-1">{ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </form>
  );
};
