export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  whatsapp: string;
  email: string;
  notes: string;
  items: OrderItem[];
  totalPrice: number;
  createdAt: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface ContactConfig {
  whatsapp: string;
  maps: string;
  instagram: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}
