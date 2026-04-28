'use client';

import { useForm } from 'react-hook-form';
import { updateContactConfig } from '@/actions';

interface FormInputs {
  address: string;
  contactPhone: string;
  contactEmail: string;
  whatsapp: string;
  businessHours: string;
  mapLat: string;
  mapLng: string;
  isContactPagePublished: boolean;
}

interface ContactConfig {
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  whatsapp?: string | null;
  businessHours?: string | null;
  mapLat?: number | null;
  mapLng?: number | null;
  isContactPagePublished?: boolean;
}

interface Props {
  config: ContactConfig;
}

export const ContactConfigForm = ({ config }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      address: config.address ?? '',
      contactPhone: config.contactPhone ?? '',
      contactEmail: config.contactEmail ?? '',
      whatsapp: config.whatsapp ?? '',
      businessHours: config.businessHours ?? '',
      mapLat: config.mapLat?.toString() ?? '',
      mapLng: config.mapLng?.toString() ?? '',
      isContactPagePublished: config.isContactPagePublished ?? false,
    },
  });

  const isPublished = watch('isContactPagePublished');
  const latValue = watch('mapLat');
  const lngValue = watch('mapLng');

  const onSubmit = async (data: FormInputs) => {
    const lat = data.mapLat ? parseFloat(data.mapLat) : null;
    const lng = data.mapLng ? parseFloat(data.mapLng) : null;

    const result = await updateContactConfig({
      address: data.address || null,
      contactPhone: data.contactPhone || null,
      contactEmail: data.contactEmail || null,
      whatsapp: data.whatsapp || null,
      businessHours: data.businessHours || null,
      mapLat: lat && !isNaN(lat) ? lat : null,
      mapLng: lng && !isNaN(lng) ? lng : null,
      isContactPagePublished: data.isContactPagePublished,
    });

    if (!result.ok) {
      alert(result.message);
      return;
    }

    alert('Configuración guardada correctamente');
  };

  const showMapPreview =
    latValue && lngValue && !isNaN(parseFloat(latValue)) && !isNaN(parseFloat(lngValue));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">

      {/* Publicar */}
      <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border">
        <input
          id="isContactPagePublished"
          type="checkbox"
          className="w-5 h-5 accent-blue-600"
          {...register('isContactPagePublished')}
        />
        <div>
          <label htmlFor="isContactPagePublished" className="font-semibold text-gray-800 cursor-pointer">
            Publicar página de contacto
          </label>
          <p className="text-sm text-gray-500">
            {isPublished
              ? 'La página está visible en el navbar para todos los visitantes.'
              : 'La página está oculta. Activá esta opción para mostrarla en el navbar.'}
          </p>
        </div>
      </div>

      {/* Dirección */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Dirección</label>
        <input
          type="text"
          placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
          className="p-2 border rounded-md bg-gray-100 w-full"
          {...register('address')}
        />
      </div>

      {/* Teléfono y Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
          <input
            type="text"
            placeholder="Ej: +54 11 1234-5678"
            className="p-2 border rounded-md bg-gray-100 w-full"
            {...register('contactPhone')}
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="Ej: contacto@tienda.com"
            className="p-2 border rounded-md bg-gray-100 w-full"
            {...register('contactEmail')}
          />
        </div>
      </div>

      {/* WhatsApp */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp</label>
        <input
          type="text"
          placeholder="Ej: 5491112345678 (sin + ni espacios)"
          className="p-2 border rounded-md bg-gray-100 w-full"
          {...register('whatsapp')}
        />
        <p className="text-xs text-gray-500 mt-1">
          Formato internacional sin el +. Ej: 5491112345678
        </p>
      </div>

      {/* Horario */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Horario de atención</label>
        <textarea
          rows={3}
          placeholder={'Ej:\nLunes a Viernes: 9:00 - 18:00\nSábados: 10:00 - 14:00'}
          className="p-2 border rounded-md bg-gray-100 w-full resize-none"
          {...register('businessHours')}
        />
      </div>

      {/* Coordenadas del mapa */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Ubicación en el mapa</label>
        <p className="text-xs text-gray-500 mb-2">
          Obtené las coordenadas haciendo clic derecho sobre tu local en Google Maps y seleccionando las coordenadas.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Latitud</label>
            <input
              type="number"
              step="any"
              placeholder="Ej: -34.6037"
              className="p-2 border rounded-md bg-gray-100 w-full"
              {...register('mapLat')}
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Longitud</label>
            <input
              type="number"
              step="any"
              placeholder="Ej: -58.3816"
              className="p-2 border rounded-md bg-gray-100 w-full"
              {...register('mapLng')}
            />
          </div>
        </div>
      </div>

      {/* Preview del mapa */}
      {showMapPreview && (
        <div>
          <p className="text-sm font-bold text-gray-700 mb-2">Vista previa del mapa</p>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(lngValue) - 0.01}%2C${parseFloat(latValue) - 0.01}%2C${parseFloat(lngValue) + 0.01}%2C${parseFloat(latValue) + 0.01}&layer=mapnik&marker=${latValue}%2C${lngValue}`}
            className="w-full h-56 rounded-lg border"
            title="Vista previa del mapa"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full sm:w-auto"
      >
        {isSubmitting ? 'Guardando...' : 'Guardar configuración'}
      </button>
    </form>
  );
};
