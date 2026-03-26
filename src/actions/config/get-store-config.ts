'use server';

const defaultConfig = {
  id: '',
  name: 'Mi Tienda',
  logoUrl: null,
  primaryColor: '#3b82f6',
  secondaryColor: '#1e293b',
  bankName: null,
  bankAccount: null,
  bankAccountType: null,
  bankOwnerName: null,
  bankCbu: null,
  bankAlias: null,
  shippingInfo: null,
  contactEmail: null,
  contactPhone: null,
  updatedAt: new Date(),
};

export const getStoreConfig = async () => {
  try {
    const resp = await fetch(`${process.env.API_URL}/config`, {
      next: { revalidate: 60 },
    });

    if (!resp.ok) return { ok: true, config: defaultConfig };

    const config = await resp.json();

    return { ok: true, config };
  } catch (error) {
    console.error('Error fetching store config:', error);
    return { ok: true, config: defaultConfig };
  }
};
