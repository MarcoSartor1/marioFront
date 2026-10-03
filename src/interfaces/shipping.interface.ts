export interface ShippingOption {
  key: string;
  token: string;
  carrierName: string;
  serviceName: string;
  serviceCode: 'standard_delivery' | 'pickup_point';
  price: number;
  estimatedDelivery: string | null;
  pickupPoint: { id: number; name: string; address: string } | null;
}

export interface ShippingQuote {
  subtotal: number;
  packageCount: number;
  expiresAt: number;
  options: ShippingOption[];
}
