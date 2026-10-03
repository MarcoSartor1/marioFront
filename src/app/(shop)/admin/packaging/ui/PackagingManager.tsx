'use client';

import { FormEvent, useRef, useState } from 'react';
import { IoCubeOutline, IoAddOutline, IoCreateOutline } from 'react-icons/io5';
import { savePackagingBox } from '@/actions/packaging/boxes';
import type { PackagingBox, PackagingBoxInput } from '@/interfaces/packaging.interface';

const numberFormat = new Intl.NumberFormat('es-AR', { maximumFractionDigits: 2 });
const inputClass = 'mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';

export function PackagingManager({ initialBoxes }: { initialBoxes: PackagingBox[] }) {
  const [boxes, setBoxes] = useState(initialBoxes);
  const [editing, setEditing] = useState<PackagingBox | null>(null);
  const [showForm, setShowForm] = useState(initialBoxes.length === 0);
  const [formVersion, setFormVersion] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const activeCount = boxes.filter((box) => box.isActive).length;
  const visibleBoxes = boxes.filter((box) => showInactive || box.isActive).sort((a, b) =>
    Number(b.isActive) - Number(a.isActive) || a.name.localeCompare(b.name, 'es'),
  );

  function openForm(box: PackagingBox | null) {
    setEditing(box);
    setFormVersion((version) => version + 1);
    setShowForm(true);
    setError('');
    setNotice('');
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      nameRef.current?.focus({ preventScroll: true });
    });
  }

  async function onSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const input: PackagingBoxInput = {
      name: String(data.get('name') ?? '').trim(),
      lengthCm: Number(data.get('lengthCm')),
      widthCm: Number(data.get('widthCm')),
      heightCm: Number(data.get('heightCm')),
      emptyWeightGrams: Number(data.get('emptyWeightGrams')),
      maxWeightGrams: data.get('maxWeightGrams') ? Number(data.get('maxWeightGrams')) : null,
      notes: String(data.get('notes') ?? '').trim(),
      isActive: data.get('isActive') === 'on',
    };
    setError('');
    setNotice('');
    if (!input.name) {
      setError('Ingresá un nombre para identificar el embalaje.');
      nameRef.current?.focus();
      return;
    }
    if (input.maxWeightGrams !== null && input.maxWeightGrams <= input.emptyWeightGrams) {
      setError('El peso máximo debe ser mayor que el peso del embalaje vacío.');
      return;
    }
    setSaving(true);
    try {
      const result = await savePackagingBox(input, editing?.id);
      if (!result.ok) {
        setError(result.message);
        return;
      }
      setBoxes((current) => editing
        ? current.map((box) => box.id === result.box.id ? result.box : box)
        : [...current, result.box]);
      if (!result.box.isActive) setShowInactive(true);
      setNotice(`“${result.box.name}” ${editing ? 'actualizado' : 'creado'} correctamente.`);
      setShowForm(false);
      setEditing(null);
    } catch {
      setError('No pudimos guardar el embalaje. Tus datos siguen en el formulario para reintentar.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mb-12 max-w-6xl space-y-6">
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-sm text-gray-700">
        <p className="font-semibold text-gray-900">Medí la caja cerrada y pesala sin productos</p>
        <p className="mt-1">Usá las medidas exteriores e incluí el peso del relleno y la protección. El peso de los productos se suma por separado.</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Tus embalajes</h2>
          <p className="text-sm text-gray-500">{activeCount} {activeCount === 1 ? 'activo' : 'activos'} · {boxes.length} en total</p>
        </div>
        <button type="button" className="btn-primary inline-flex items-center gap-2 disabled:cursor-wait" disabled={saving} onClick={() => openForm(null)}>
          <IoAddOutline aria-hidden="true" size={20} /> Nuevo embalaje
        </button>
      </div>

      <p role="status" aria-live="polite" className={notice ? 'rounded-lg bg-green-50 p-3 text-sm text-green-800' : 'sr-only'}>{notice}</p>

      {showForm && (
        <form key={formVersion} ref={formRef} onSubmit={onSave} className="scroll-mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="box-form-title" aria-busy={saving}>
          <h3 id="box-form-title" className="mb-5 text-lg font-semibold">{editing ? 'Editar embalaje' : 'Nuevo embalaje'}</h3>
          <fieldset disabled={saving} className="space-y-5 disabled:opacity-60">
            <div>
              <label htmlFor="box-name" className="text-sm font-medium">Nombre</label>
              <input ref={nameRef} id="box-name" name="name" required maxLength={80} defaultValue={editing?.name ?? ''} placeholder="Ej.: Caja para mate y bombilla" className={inputClass} />
            </div>
            <fieldset>
              <legend className="text-sm font-medium">Medidas exteriores de la caja cerrada</legend>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {([
                  ['lengthCm', 'Largo'], ['widthCm', 'Ancho'], ['heightCm', 'Alto'],
                ] as const).map(([key, label]) => (
                  <div key={key}>
                    <label htmlFor={`box-${key}`} className="text-sm text-gray-600">{label} (cm)</label>
                    <input id={`box-${key}`} name={key} type="number" inputMode="decimal" required min={1} max={5000} step="0.01" defaultValue={editing?.[key] ?? ''} className={inputClass} />
                  </div>
                ))}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="box-empty-weight" className="text-sm font-medium">Peso del embalaje vacío (g)</label>
                <input id="box-empty-weight" name="emptyWeightGrams" type="number" inputMode="numeric" required min={1} max={10000000} step={1} defaultValue={editing?.emptyWeightGrams ?? ''} aria-describedby="box-weight-help" className={inputClass} />
                <p id="box-weight-help" className="mt-1 text-xs text-gray-500">Caja + relleno + protección, sin productos. 1 kg = 1.000 g.</p>
              </div>
              <div>
                <label htmlFor="box-max-weight" className="text-sm font-medium">Peso máximo total (g, opcional)</label>
                <input id="box-max-weight" name="maxWeightGrams" type="number" inputMode="numeric" min={1} max={10000000} step={1} defaultValue={editing?.maxWeightGrams ?? ''} aria-describedby="box-max-help" className={inputClass} />
                <p id="box-max-help" className="mt-1 text-xs text-gray-500">Máximo que soporta con productos incluidos. Dejalo vacío si no lo conocés.</p>
              </div>
            </div>
            <div>
              <label htmlFor="box-notes" className="text-sm font-medium">Notas de uso (opcional)</label>
              <textarea id="box-notes" name="notes" maxLength={500} rows={2} defaultValue={editing?.notes ?? ''} placeholder="Ej.: Usar separadores para proteger el mate." className={inputClass} />
            </div>
            <label className="flex items-start gap-3 text-sm" htmlFor="box-active">
              <input id="box-active" name="isActive" type="checkbox" defaultChecked={editing?.isActive ?? true} className="mt-1 h-4 w-4 accent-primary" />
              <span><span className="font-medium">Embalaje activo</span><span className="mt-1 block text-gray-500">Desactivalo si dejás de usar esta caja. Podés volver a activarlo después.</span></span>
            </label>
          </fieldset>
          {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="btn-primary disabled:cursor-wait">{saving ? 'Guardando…' : editing ? 'Guardar cambios' : 'Guardar embalaje'}</button>
            <button type="button" disabled={saving} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50" onClick={() => { setShowForm(false); setError(''); }}>Cancelar</button>
          </div>
        </form>
      )}

      {boxes.some((box) => !box.isActive) && (
        <label className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" checked={showInactive} onChange={(event) => setShowInactive(event.target.checked)} className="h-4 w-4 accent-primary" /> Mostrar también los inactivos
        </label>
      )}

      {visibleBoxes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-10 text-center">
          <IoCubeOutline aria-hidden="true" size={40} className="mx-auto mb-3 text-primary" />
          <h3 className="font-semibold text-gray-900">{boxes.length ? 'No hay embalajes activos' : 'Guardá tu primera caja'}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{boxes.length ? 'Mostrá los inactivos para editar y activar uno, o agregá un nuevo embalaje.' : 'Podés crear una caja pequeña, mediana o grande con las medidas que realmente usás para despachar.'}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleBoxes.map((box) => (
            <article key={box.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <IoCubeOutline aria-hidden="true" size={28} className="shrink-0 text-primary" />
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${box.isActive ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>{box.isActive ? 'Activo' : 'Inactivo'}</span>
              </div>
              <h3 className="mt-3 break-words text-lg font-semibold text-gray-900">{box.name}</h3>
              <p className="mt-3 text-xl font-semibold tabular-nums">{[box.lengthCm, box.widthCm, box.heightCm].map((value) => numberFormat.format(value)).join(' × ')} <span className="text-sm font-normal text-gray-500">cm</span></p>
              <p className="text-xs text-gray-500">Largo × ancho × alto · medidas exteriores</p>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-2"><dt className="text-gray-500">Peso vacío</dt><dd>{numberFormat.format(box.emptyWeightGrams)} g</dd></div>
                <div className="flex justify-between gap-2"><dt className="text-gray-500">Peso máximo total</dt><dd>{box.maxWeightGrams === null ? 'Sin definir' : `${numberFormat.format(box.maxWeightGrams)} g`}</dd></div>
              </dl>
              {box.notes && <p className="mt-4 whitespace-pre-wrap break-words rounded-lg bg-gray-50 p-3 text-sm text-gray-600">{box.notes}</p>}
              <button type="button" disabled={saving} onClick={() => openForm(box)} aria-label={`Editar ${box.name}`} className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-50"><IoCreateOutline aria-hidden="true" size={18} /> Editar embalaje</button>
            </article>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500">Estas medidas describen el embalaje. La cotización automática se habilitará al completar los pesos y perfiles de los productos que van dentro.</p>
    </div>
  );
}
