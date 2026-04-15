export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'mercadopago' | 'transfer';

export interface OrderProduct {
  title: string;
  size: string | null;
  quantity: number;
  price: number;
}

export interface AdminOrder {
  id: string;
  fullName: string;
  email: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod | null;
  paymentReceipt: string | null;
  createdAt: string;
  products: OrderProduct[];
}

export interface Order {
  id: string;
  isPaid: boolean;
  paidAt: string | null;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentReceipt: string | null;
  subTotal: number;
  tax: number;
  total: number;
  itemsInOrder: number;
  address: {
    firstName: string;
    lastName: string;
    address: string;
    address2?: string;
    postalCode: string;
    city: string;
    phone: string;
  } | null;
  items: {
    productId: string;
    quantity: number;
    price: number;
    size: string | null;
    product: {
      title: string;
      images: { url: string }[];
    };
  }[];
}
