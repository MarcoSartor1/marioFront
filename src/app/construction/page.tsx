import { getStoreConfig } from '@/actions';
import Link from 'next/link';

export default async function ConstructionPage() {
  const { config } = await getStoreConfig();

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-lg w-full text-center">

        {config.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={config.logoUrl}
            alt={config.name}
            className="h-20 mx-auto mb-8 object-contain"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-8 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{config.name}</h1>

        <div className="w-16 h-1 bg-gray-300 mx-auto mb-6 rounded-full" />

        <p className="text-xl font-semibold text-gray-700 mb-3">
          Sitio en construcción
        </p>
        <p className="text-gray-500 mb-8">
          Estamos trabajando para ofrecerte la mejor experiencia. Volvé pronto.
        </p>

        {(config.contactEmail || config.contactPhone) && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8 text-sm text-gray-600 space-y-2">
            <p className="font-medium text-gray-700 mb-3">Contacto</p>
            {config.contactEmail && (
              <p>
                <a
                  href={`mailto:${config.contactEmail}`}
                  className="text-blue-600 hover:underline"
                >
                  {config.contactEmail}
                </a>
              </p>
            )}
            {config.contactPhone && (
              <p>
                <a
                  href={`tel:${config.contactPhone}`}
                  className="text-blue-600 hover:underline"
                >
                  {config.contactPhone}
                </a>
              </p>
            )}
          </div>
        )}

        <Link
          href="/auth/login"
          className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
        >
          Acceso administrador
        </Link>
      </div>
    </main>
  );
}
