import type { OrderItem } from '../types';

export interface CartEntry {
  item: OrderItem;
  img: string;
}

// Global Cart State
export let cart: CartEntry[] = [];

// Allow subscribing to cart changes
type Listener = (cart: CartEntry[]) => void;
const listeners: Listener[] = [];

export function subscribeCart(listener: Listener) {
  listeners.push(listener);
}

function notifyListeners() {
  listeners.forEach(l => l(cart));
}

export function addToCart(name: string, price: number, img: string) {
  const existing = cart.find(entry => entry.item.name === name);
  if (existing) {
    existing.item.quantity += 1;
  } else {
    cart.push({
      item: { name, price, quantity: 1 },
      img
    });
  }
  notifyListeners();
}

export function updateQuantity(index: number, newQuantity: number) {
  if (cart[index]) {
    if (newQuantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].item.quantity = newQuantity;
    }
    notifyListeners();
  }
}

export function clearCart() {
  cart = [];
  notifyListeners();
}
