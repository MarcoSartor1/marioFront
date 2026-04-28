'use client';

import { useState, useTransition } from 'react';
import { updatePublishedStatus } from '@/actions';

interface Props {
  isPublished: boolean;
}

export const PublishToggle = ({ isPublished: initial }: Props) => {
  const [isPublished, setIsPublished] = useState(initial);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleToggle = () => {
    const next = !isPublished;
    startTransition(async () => {
      setError(null);
      const result = await updatePublishedStatus(next);
      if (result.ok) {
        setIsPublished(next);
      } else {
        setError(result.message ?? 'Error al actualizar');
      }
    });
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 ${
          isPublished
            ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {isPending
          ? 'Actualizando...'
          : isPublished
          ? 'Poner en construcción'
          : 'Publicar sitio'}
      </button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <p className="text-xs text-gray-400">
        {isPublished
          ? 'Al poner en construcción, los usuarios verán la página de mantenimiento.'
          : 'Al publicar, los usuarios podrán acceder al sitio normalmente.'}
      </p>
    </div>
  );
};
