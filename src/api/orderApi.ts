import type { Order, OrderItem } from '../types';
import { supabase } from './supabase';

export async function fetchOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) throw error;
    return (data || []) as Order[];
  } catch (error) {
    console.error('Failed to fetch orders from Supabase:', error);
    return [];
  }
}

export async function createOrder(
  customerName: string, 
  whatsapp: string, 
  email: string, 
  notes: string, 
  items: OrderItem[], 
  totalPrice: number
): Promise<boolean> {
  try {
    const id = 'TR-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder = {
      id,
      customerName,
      whatsapp,
      email,
      notes,
      items,
      totalPrice,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const { error } = await supabase
      .from('orders')
      .insert([newOrder]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to create order:', JSON.stringify(error, null, 2));
    return false;
  }
}

export async function updateOrderStatus(id: string, status: 'completed' | 'cancelled'): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    // Jika tidak ada data yang dikembalikan, berarti baris tidak ter-update (kemungkinan karena RLS atau ID tidak cocok)
    if (!data || data.length === 0) {
      console.warn('Update failed: No rows matched or RLS policy prevented update.');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to update order status:', error);
    return false;
  }
}
