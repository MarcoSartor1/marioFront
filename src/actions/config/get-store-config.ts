'use server';

const defaultConfig = {
  id: '',
  name: 'Costumbres Argentina',
  logoUrl: null,
  showTitleWithLogo: false,
  primaryColor: '#C4622D',
  secondaryColor: '#8B4513',
  bankName: null,
  bankAccount: null,
  bankAccountType: null,
  bankOwnerName: null,
  bankCbu: null,
  bankAlias: null,
  shippingInfo: null,
  shippingCostSucursal: 8000,
  shippingCostDomicilio: 10000,
  freeShippingCities: '',
  contactEmail: null,
  contactPhone: null,
  address: null,
  mapLat: null,
  mapLng: null,
  businessHours: null,
  whatsapp: null,
  isContactPagePublished: false,
  isPublished: true,
  xubioStockAdjustmentDoc: null,
  xubioListaPrecioId: null,
  updatedAt: new Date(),
};

export const getStoreConfig = async () => {
  try {
    const resp = await fetch(`${process.env.API_URL}/config`, {
      next: { revalidate: 60, tags: ['store-config'] },
    });

    if (!resp.ok) return { ok: true, config: defaultConfig };

    const config = await resp.json();

    return { ok: true, config };
  } catch (error) {
    console.error('Error fetching store config:', error);
    return { ok: true, config: defaultConfig };
  }
};
