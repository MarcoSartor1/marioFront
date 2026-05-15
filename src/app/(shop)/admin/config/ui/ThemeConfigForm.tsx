'use client';

import { useRef, useState, useTransition } from 'react';
import { updateThemeConfig } from '@/actions/config/update-theme-config';

const PRESETS = [
  { label: 'Terracota', primary: '#C4622D', secondary: '#8B4513' },
  { label: 'Verde Mate', primary: '#3D7A4B', secondary: '#2A5434' },
  { label: 'Azul Andino', primary: '#274494', secondary: '#0b54e5' },
  { label: 'Bordo', primary: '#7B1C2E', secondary: '#4A0F1B' },
];

interface Props {
  currentPrimary: string;
  currentSecondary: string;
}

export const ThemeConfigForm = ({ currentPrimary, currentSecondary }: Props) => {
  const [primary, setPrimary] = useState(currentPrimary);
  const [secondary, setSecondary] = useState(currentSecondary);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const applyPreset = (p: string, s: string) => {
    setPrimary(p);
    setSecondary(s);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const fd = new FormData();
      fd.set('primaryColor', primary);
      fd.set('secondaryColor', secondary);
      const result = await updateThemeConfig(fd);
      if (result.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {PRESETS.map(p => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(p.primary, p.secondary)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-sm hover:border-gray-400 transition-colors"
          >
            <span className="w-3.5 h-3.5 rounded-full border border-black/10" style={{ background: p.primary }} />
            {p.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color principal</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={primary}
              onChange={e => setPrimary(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-sm text-gray-500 font-mono">{primary}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Color secundario</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={secondary}
              onChange={e => setSecondary(e.target.value)}
              className="w-10 h-10 rounded cursor-pointer border border-gray-200"
            />
            <span className="text-sm text-gray-500 font-mono">{secondary}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="flex gap-2 items-center text-sm text-gray-500">
          <span>Vista previa:</span>
          <button type="button" className="px-3 py-1 rounded text-white text-xs font-semibold" style={{ background: primary }}>
            Botón
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary text-sm disabled:opacity-60"
      >
        {isPending ? 'Guardando...' : saved ? 'Guardado!' : 'Guardar colores'}
      </button>
    </form>
  );
};
