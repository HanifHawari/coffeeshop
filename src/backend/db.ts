import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Ensure data directory and files exist
function initDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    const defaultConfig = {
      whatsapp: 'https://wa.me/628123456789?text=Halo%20The%20Quiet%20Ritual',
      maps: 'https://maps.google.com/?q=The+Quiet+Ritual+Coffee+Roasters',
      instagram: 'https://instagram.com/thequietritual',
      email: 'mailto:info@thequietritual.com',
      phone: 'tel:+628123456789',
      address: '123 Jalan Ketenangan, Distrik Artisan',
      hours: 'Setiap Hari: 08:00 - 20:00'
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(defaultConfig, null, 2), 'utf-8');
  }
}

// Order interface
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

// Database operations
export const db = {
  getOrders(): Order[] {
    try {
      initDB();
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data) as Order[];
    } catch (e) {
      console.error('Error reading orders:', e);
      return [];
    }
  },

  saveOrder(order: Omit<Order, 'id' | 'createdAt' | 'status'>): Order {
    initDB();
    const orders = this.getOrders();
    const newOrder: Order = {
      ...order,
      id: 'TR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    orders.unshift(newOrder); // Add to the top
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
    return newOrder;
  },

  updateOrderStatus(id: string, status: Order['status']): boolean {
    initDB();
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].status = status;
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
      return true;
    }
    return false;
  },

  getConfig(): ContactConfig {
    try {
      initDB();
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(data) as ContactConfig;
    } catch (e) {
      console.error('Error reading config:', e);
      return {
        whatsapp: '#',
        maps: '#',
        instagram: '#',
        email: '#',
        phone: '#',
        address: '123 Jalan Ketenangan',
        hours: '08:00 - 20:00'
      };
    }
  },

  saveConfig(newConfig: Partial<ContactConfig>): ContactConfig {
    initDB();
    const currentConfig = this.getConfig();
    const updated = { ...currentConfig, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  }
};
