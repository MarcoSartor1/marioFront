export const revalidate = 0;

import { getStoreConfig, getXubioConfigData } from '@/actions';
import { Title } from '@/components';
import { PublishToggle } from './ui/PublishToggle';
import { LogoUploader } from './ui/LogoUploader';
import { ShippingConfigForm } from './ui/ShippingConfigForm';
import { XubioConfigForm } from './ui/XubioConfigForm';
import { ThemeConfigForm } from './ui/ThemeConfigForm';

export default async function AdminConfigPage() {
  const [{ config }, { ajustesStock, listasPrecio }] = await Promise.all([
    getStoreConfig(),
    getXubioConfigData(),
  ]);
  const isPublished = config.isPublished !== false;

  return (
    <>
      <Title title="Configuración del sitio" />

      <div className="max-w-md space-y-6">

        {/* Logo */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Logo</h2>
          <p className="text-sm text-gray-500 mb-6">
            El logo aparece en el menú superior, la página de construcción y
            la pestaña del navegador.
          </p>
          <LogoUploader
            currentLogoUrl={config.logoUrl ?? null}
            showTitleWithLogo={config.showTitleWithLogo ?? false}
          />
        </div>

        {/* Estado del sitio */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            Estado del sitio
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Cuando el sitio está en construcción, solo los administradores
            pueden acceder. Los usuarios comunes ven la página de mantenimiento.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                isPublished
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isPublished ? 'bg-green-500' : 'bg-yellow-500'
                }`}
              />
              {isPublished ? 'Publicado' : 'En construcción'}
            </span>
          </div>

          <PublishToggle isPublished={isPublished} />
        </div>

        {/* Colores del sitio */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Colores del sitio</h2>
          <p className="text-sm text-gray-500 mb-6">
            Personalizá los colores principales. Los cambios se aplican en toda la tienda.
          </p>
          <ThemeConfigForm
            currentPrimary={config.primaryColor ?? '#C4622D'}
            currentSecondary={config.secondaryColor ?? '#8B4513'}
          />
        </div>

        {/* Costos de envío */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Costos de envío</h2>
          <p className="text-sm text-gray-500 mb-6">
            Definí los costos de envío y las ciudades donde el envío es gratis.
          </p>
          <ShippingConfigForm
            shippingCostSucursal={config.shippingCostSucursal ?? 8000}
            shippingCostDomicilio={config.shippingCostDomicilio ?? 10000}
            freeShippingCities={config.freeShippingCities ?? ''}
          />
        </div>

        {/* Integración Xubio */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">Integración Xubio</h2>
          <p className="text-sm text-gray-500 mb-6">
            Configurá el ajuste de stock de referencia y la lista de precios usada para la sincronización con Xubio.
          </p>
          <XubioConfigForm
            ajustesStock={ajustesStock}
            listasPrecio={listasPrecio}
            initialStockAdjustmentDoc={config.xubioStockAdjustmentDoc ?? null}
            initialListaPrecioId={config.xubioListaPrecioId ?? null}
          />
        </div>

      </div>
    </>
  );
}
