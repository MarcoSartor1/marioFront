'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createHomeSlide, deleteHomeSlide, reorderHomeSlides, updateHomeSlide } from '@/actions';
import type { HomeSlide } from '@/actions/config/get-home-slides';

interface Props {
  initialSlides: HomeSlide[];
}

const MAX_SLIDES = 5;

export const SliderManager = ({ initialSlides }: Props) => {
  const router = useRouter();
  const [slides, setSlides] = useState(initialSlides);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newLink, setNewLink] = useState('');
  const [newFile, setNewFile] = useState<File | null>(null);
  const [newPreview, setNewPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('El archivo supera 2 MB. Elegí una imagen más liviana.');
      e.target.value = '';
      return;
    }
    setError(null);
    setNewFile(file);
    setNewPreview(URL.createObjectURL(file));
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (slides.length >= MAX_SLIDES) {
      setError(`Límite de ${MAX_SLIDES} slides alcanzado. Eliminá alguno para agregar más.`);
      return;
    }
    if (!newFile) {
      setError('Elegí una imagen para el slide.');
      return;
    }
    setError(null);

    const fd = new FormData();
    fd.set('image', newFile);
    fd.set('title', newTitle);
    fd.set('subtitle', newSubtitle);
    fd.set('linkUrl', newLink);

    startTransition(async () => {
      const result = await createHomeSlide(fd);
      if (!result.ok || !result.slide) {
        setError(result.message ?? 'Error al agregar el slide');
        return;
      }
      setSlides(prev => [...prev, result.slide]);
      setNewTitle('');
      setNewSubtitle('');
      setNewLink('');
      setNewFile(null);
      setNewPreview(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
      router.refresh();
    });
  };

  const handleFieldChange = (id: string, field: 'title' | 'subtitle' | 'linkUrl', value: string) => {
    setSlides(prev => prev.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleSaveFields = (slide: HomeSlide) => {
    startTransition(async () => {
      await updateHomeSlide(slide.id, {
        title: slide.title ?? '',
        subtitle: slide.subtitle ?? '',
        linkUrl: slide.linkUrl ?? '',
      });
    });
  };

  const handleToggleActive = (slide: HomeSlide) => {
    startTransition(async () => {
      const result = await updateHomeSlide(slide.id, { isActive: !slide.isActive });
      if (result.ok) {
        setSlides(prev => prev.map(s => (s.id === slide.id ? { ...s, isActive: !s.isActive } : s)));
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteHomeSlide(id);
      if (result.ok) {
        setSlides(prev => prev.filter(s => s.id !== id));
      }
    });
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= slides.length) return;

    const reordered = [...slides];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setSlides(reordered);

    startTransition(async () => {
      await reorderHomeSlides(reordered.map(s => s.id));
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Slides cargados</p>
        <span className={`text-sm ${slides.length >= MAX_SLIDES ? 'text-red-500' : 'text-gray-400'}`}>
          {slides.length}/{MAX_SLIDES}
        </span>
      </div>

      {slides.length > 0 && (
        <div className="space-y-3">
          {slides.map((slide, index) => (
            <div key={slide.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex gap-3">
                <div className="relative h-16 w-28 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                  <Image src={slide.imageUrl} alt={slide.title ?? 'Slide'} fill className="object-cover" unoptimized />
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    value={slide.title ?? ''}
                    onChange={e => handleFieldChange(slide.id, 'title', e.target.value)}
                    onBlur={() => handleSaveFields(slide)}
                    placeholder="Título (opcional)"
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  />
                  <input
                    value={slide.subtitle ?? ''}
                    onChange={e => handleFieldChange(slide.id, 'subtitle', e.target.value)}
                    onBlur={() => handleSaveFields(slide)}
                    placeholder="Subtítulo (opcional)"
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  />
                  <input
                    value={slide.linkUrl ?? ''}
                    onChange={e => handleFieldChange(slide.id, 'linkUrl', e.target.value)}
                    onBlur={() => handleSaveFields(slide)}
                    placeholder="Link (ej: /category/mates)"
                    className="w-full text-sm border border-gray-200 rounded px-2 py-1"
                  />
                </div>

                <div className="flex flex-col items-center justify-between gap-1">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0 || isPending}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1"
                      aria-label="Subir"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(index, 1)}
                      disabled={index === slides.length - 1 || isPending}
                      className="text-gray-400 hover:text-gray-700 disabled:opacity-30 text-xs px-1"
                      aria-label="Bajar"
                    >
                      ▼
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id)}
                    disabled={isPending}
                    className="text-xs text-red-500 hover:text-red-700 underline disabled:opacity-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 mt-2 text-xs text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={slide.isActive}
                  onChange={() => handleToggleActive(slide)}
                  disabled={isPending}
                  className="accent-blue-600"
                />
                Visible en la home
              </label>
            </div>
          ))}
        </div>
      )}

      {slides.length >= MAX_SLIDES ? (
        <p className="text-sm text-red-500 border border-dashed border-red-200 rounded-lg p-4">
          Límite de {MAX_SLIDES} slides alcanzado. Eliminá alguno para agregar más.
        </p>
      ) : (
        <form onSubmit={handleAdd} className="border border-dashed border-gray-300 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Agregar slide</p>
          <p className="text-xs text-gray-400">
            Recomendado: 1920&times;800&nbsp;px (relación panorámica ~21:9) &mdash; menos de 2&nbsp;MB
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="block text-sm text-gray-600
              file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0
              file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700
              hover:file:bg-gray-200 cursor-pointer"
          />

          {newPreview && (
            <div className="relative h-24 w-full max-w-xs rounded-md overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={newPreview} alt="Preview" className="h-full w-full object-cover" />
            </div>
          )}

          <input
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="Título (opcional)"
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5"
          />
          <input
            value={newSubtitle}
            onChange={e => setNewSubtitle(e.target.value)}
            placeholder="Subtítulo (opcional)"
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5"
          />
          <input
            value={newLink}
            onChange={e => setNewLink(e.target.value)}
            placeholder="Link (ej: /category/mates)"
            className="w-full text-sm border border-gray-200 rounded px-2 py-1.5"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">Slide agregado correctamente.</p>}

          <button
            type="submit"
            disabled={isPending}
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
          >
            {isPending ? 'Guardando...' : 'Agregar slide'}
          </button>
        </form>
      )}
    </div>
  );
};
