export type OrderStatus = 'pending' | 'processing' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

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
  createdAt: string;
  products: OrderProduct[];
}
