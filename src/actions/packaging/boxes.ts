'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';
import type { PackagingBox, PackagingBoxInput } from '@/interfaces/packaging.interface';

const dimension = z.number().finite().min(1).max(5000).refine(
  (value) => Math.abs(value * 100 - Math.round(value * 100)) < 0.000001,
  'Usá hasta dos decimales para las medidas.',
);
const boxSchema = z.object({
  name: z.string().trim().min(1).max(80),
  lengthCm: dimension,
  widthCm: dimension,
  heightCm: dimension,
  emptyWeightGrams: z.number().int().min(1).max(10000000),
  maxWeightGrams: z.number().int().min(1).max(10000000).nullable(),
  notes: z.string().trim().max(500),
  isActive: z.boolean(),
}).refine((box) => box.maxWeightGrams === null || box.maxWeightGrams > box.emptyWeightGrams, {
  message: 'El peso máximo debe ser mayor que el peso del embalaje vacío.',
  path: ['maxWeightGrams'],
});

export async function getPackagingBoxes(): Promise<
  { ok: true; boxes: PackagingBox[] } | { ok: false; message: string }
> {
  if ((await auth())?.user.role !== 'admin') return { ok: false, message: 'No autorizado.' };
  try {
    const response = await apiFetch('/packaging/boxes', { cache: 'no-store' });
    if (!response.ok) return { ok: false, message: 'No pudimos cargar los embalajes. Intentá nuevamente.' };
    return { ok: true, boxes: await response.json() };
  } catch {
    return { ok: false, message: 'No pudimos conectar con el servidor. Intentá nuevamente.' };
  }
}

export async function savePackagingBox(input: PackagingBoxInput, id?: string): Promise<
  { ok: true; box: PackagingBox } | { ok: false; message: string }
> {
  if ((await auth())?.user.role !== 'admin') return { ok: false, message: 'No autorizado.' };
  const parsed = boxSchema.safeParse(input);
  if (!parsed.success || (id !== undefined && !z.string().uuid().safeParse(id).success)) {
    return { ok: false, message: 'Revisá el nombre, las medidas y los pesos. El peso máximo debe superar al peso vacío.' };
  }
  try {
    const response = await apiFetch(id ? `/packaging/boxes/${id}` : '/packaging/boxes', {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(parsed.data),
    });
    if (!response.ok) {
      const messages: Record<number, string> = {
        400: 'Revisá las medidas y los pesos ingresados.',
        401: 'Tu sesión venció. Volvé a ingresar.',
        403: 'No tenés permiso para modificar embalajes.',
        404: 'El embalaje ya no está disponible. Actualizá la página.',
        409: 'Ya existe un embalaje con ese nombre. Elegí otro.',
      };
      return { ok: false, message: messages[response.status] ?? 'No pudimos guardar el embalaje. Intentá nuevamente.' };
    }
    const box: PackagingBox = await response.json();
    revalidatePath('/admin/packaging');
    return { ok: true, box };
  } catch {
    return { ok: false, message: 'No pudimos conectar con el servidor. Intentá nuevamente.' };
  }
}
