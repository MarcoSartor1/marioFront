import { notFound } from 'next/navigation';
import { getStoreConfig } from '@/actions';
import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoWhatsapp,
  IoTimeOutline,
} from 'react-icons/io5';

export default async function ContactPage() {
  const { config } = await getStoreConfig();

  if (!config?.isContactPagePublished) {
    notFound();
  }

  const hasMap =
    config.mapLat != null &&
    config.mapLng != null &&
    !isNaN(Number(config.mapLat)) &&
    !isNaN(Number(config.mapLng));

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Contacto</h1>
      <p className="text-gray-500 mb-10">Encontranos o escribinos, estamos para ayudarte.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

        {config.address && (
          <div className="flex gap-3">
            <IoLocationOutline size={24} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Dirección</p>
              <p className="text-gray-600">{config.address}</p>
            </div>
          </div>
        )}

        {config.contactPhone && (
          <div className="flex gap-3">
            <IoCallOutline size={24} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Teléfono</p>
              <a
                href={`tel:${config.contactPhone}`}
                className="text-blue-600 hover:underline"
              >
                {config.contactPhone}
              </a>
            </div>
          </div>
        )}

        {config.contactEmail && (
          <div className="flex gap-3">
            <IoMailOutline size={24} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Email</p>
              <a
                href={`mailto:${config.contactEmail}`}
                className="text-blue-600 hover:underline"
              >
                {config.contactEmail}
              </a>
            </div>
          </div>
        )}

        {config.whatsapp && (
          <div className="flex gap-3">
            <IoLogoWhatsapp size={24} className="text-green-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">WhatsApp</p>
              <a
                href={`https://wa.me/${config.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:underline"
              >
                Escribinos por WhatsApp
              </a>
            </div>
          </div>
        )}

        {config.businessHours && (
          <div className="flex gap-3 md:col-span-2">
            <IoTimeOutline size={24} className="text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-gray-800">Horario de atención</p>
              <p className="text-gray-600 whitespace-pre-line">{config.businessHours}</p>
            </div>
          </div>
        )}

      </div>

      {hasMap && (
        <div>
          <h2 className="text-xl font-semibold mb-3">Cómo llegar</h2>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(config.mapLng) - 0.01}%2C${Number(config.mapLat) - 0.01}%2C${Number(config.mapLng) + 0.01}%2C${Number(config.mapLat) + 0.01}&layer=mapnik&marker=${config.mapLat}%2C${config.mapLng}`}
            className="w-full h-80 rounded-xl border"
            title="Ubicación del local"
            loading="lazy"
          />
          <a
            href={`https://www.openstreetmap.org/?mlat=${config.mapLat}&mlon=${config.mapLng}#map=16/${config.mapLat}/${config.mapLng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center text-sm text-blue-600 hover:underline mt-2"
          >
            Ver mapa más grande
          </a>
        </div>
      )}
    </div>
  );
}
