import type { Order, ContactConfig } from '../types';
import { formatCurrency, showToast } from '../utils/helpers';
import { fetchAndApplyConfig } from '../api/mockApi.ts';

export function initAdminUI() {
  const tabOrders = document.getElementById('tab-orders');
  const tabConfig = document.getElementById('tab-config');
  const panelOrders = document.getElementById('panel-orders');
  const panelConfig = document.getElementById('panel-config');

  tabOrders?.addEventListener('click', () => {
    tabOrders.classList.add('border-secondary', 'text-secondary');
    tabOrders.classList.remove('border-transparent', 'text-outline');
    tabConfig?.classList.remove('border-secondary', 'text-secondary');
    tabConfig?.classList.add('border-transparent', 'text-outline');

    panelOrders?.classList.remove('hidden');
    panelConfig?.classList.add('hidden');
    fetchAdminOrders();
  });

  tabConfig?.addEventListener('click', () => {
    tabConfig.classList.add('border-secondary', 'text-secondary');
    tabConfig.classList.remove('border-transparent', 'text-outline');
    tabOrders?.classList.remove('border-secondary', 'text-secondary');
    tabOrders?.classList.add('border-transparent', 'text-outline');

    panelConfig?.classList.remove('hidden');
    panelOrders?.classList.add('hidden');
  });

  setupConfigForm();
}

export async function fetchAdminOrders() {
  const emptyState = document.getElementById('admin-orders-empty');
  const listEl = document.getElementById('admin-orders-list');
  if (!listEl || !emptyState) return;

  try {
    // Mock Fetching Orders from localStorage
    const saved = localStorage.getItem('mockOrders');
    const orders: Order[] = saved ? JSON.parse(saved) : [];

    if (orders.length === 0) {
      emptyState.classList.remove('hidden');
      listEl.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.innerHTML = '';

    orders.forEach((order, index) => {
      const dateText = new Date(order.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const orderCard = document.createElement('div');
      orderCard.className = `p-4 rounded-xl border bg-surface space-y-3 transition-all duration-300 hover:shadow-md ${
        order.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' : 
        order.status === 'cancelled' ? 'border-rose-500/20 bg-rose-500/5' : 'border-outline-variant'
      }`;

      const itemsHtml = order.items.map(item => `
        <div class="flex justify-between text-sm">
          <span class="text-primary">${item.name} <span class="text-secondary font-bold">x${item.quantity}</span></span>
          <span class="font-bold text-primary">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');

      const statusBadge = 
        order.status === 'completed' ? `<span class="bg-emerald-600 text-white text-[11px] font-bold px-2 py-1 rounded">Selesai</span>` :
        order.status === 'cancelled' ? `<span class="bg-rose-600 text-white text-[11px] font-bold px-2 py-1 rounded">Batal</span>` :
        `<span class="bg-amber-600 text-white text-[11px] font-bold px-2 py-1 rounded animate-pulse">Menunggu</span>`;

      orderCard.innerHTML = `
        <div class="flex justify-between items-start border-b border-outline-variant/35 pb-2">
          <div>
            <span class="text-xs font-bold font-mono text-outline">${order.id}</span>
            <h4 class="font-bold text-primary text-body-lg">${order.customerName}</h4>
            <p class="text-[11px] text-on-surface-variant">${dateText}</p>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>
        <div class="space-y-1.5 py-1">
          ${itemsHtml}
        </div>
        <div class="flex justify-between items-center pt-2 border-t border-outline-variant/35 text-primary">
          <span class="text-sm font-semibold">Total Pesanan</span>
          <span class="font-bold text-body-lg text-secondary">${formatCurrency(order.totalPrice)}</span>
        </div>
        ${order.notes ? `
          <div class="bg-surface-container/60 p-2.5 rounded text-xs text-on-surface-variant italic">
            <strong>Catatan:</strong> ${order.notes}
          </div>
        ` : ''}
        
        <div class="flex gap-2 text-xs">
          <a href="https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(order.customerName)}%20dari%20The%20Quiet%20Ritual" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 rounded flex items-center justify-center gap-1 font-bold">
            <span class="material-symbols-outlined text-[14px]">chat</span> Chat WA
          </a>
          ${order.status === 'pending' ? `
            <button class="flex-1 bg-primary text-white py-1.5 rounded font-bold cursor-pointer hover:bg-primary-container btn-complete" data-id="${order.id}">Selesai</button>
            <button class="bg-outline-variant hover:bg-rose-600 hover:text-white text-primary px-3 py-1.5 rounded font-bold cursor-pointer btn-cancel" data-id="${order.id}">Batal</button>
          ` : ''}
        </div>
      `;

      orderCard.querySelector('.btn-complete')?.addEventListener('click', async () => {
        await updateStatus(index, 'completed');
      });

      orderCard.querySelector('.btn-cancel')?.addEventListener('click', async () => {
        if (confirm('Yakin ingin membatalkan pesanan ini?')) {
          await updateStatus(index, 'cancelled');
        }
      });

      listEl.appendChild(orderCard);
    });
  } catch (err) {
    console.error('Failed to load orders inside admin:', err);
  }
}

async function updateStatus(index: number, status: 'completed' | 'cancelled') {
  try {
    const saved = localStorage.getItem('mockOrders');
    const orders: Order[] = saved ? JSON.parse(saved) : [];
    
    if (orders[index]) {
      orders[index].status = status;
      localStorage.setItem('mockOrders', JSON.stringify(orders));
      showToast(`Status pesanan diperbarui menjadi ${status === 'completed' ? 'Selesai' : 'Batal'}.`, 'success');
      fetchAdminOrders();
    }
  } catch {
    showToast('Gagal memperbarui status pesanan', 'error');
  }
}

function setupConfigForm() {
  const configForm = document.getElementById('config-form');
  configForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cfgWhatsapp = (document.getElementById('cfg-whatsapp') as HTMLInputElement).value;
    const cfgMaps = (document.getElementById('cfg-maps') as HTMLInputElement).value;
    const cfgInstagram = (document.getElementById('cfg-instagram') as HTMLInputElement).value;
    const cfgEmail = (document.getElementById('cfg-email') as HTMLInputElement).value;
    const cfgAddress = (document.getElementById('cfg-address') as HTMLInputElement).value;
    const cfgHours = (document.getElementById('cfg-hours') as HTMLInputElement).value;

    const newConfig: ContactConfig = {
      whatsapp: cfgWhatsapp,
      maps: cfgMaps,
      instagram: cfgInstagram,
      email: cfgEmail,
      address: cfgAddress,
      hours: cfgHours,
      phone: '' // keeping phone empty or add if needed
    };

    try {
      // Save locally for phase 1 mock
      localStorage.setItem('mockConfig', JSON.stringify(newConfig));
      showToast('Konfigurasi info kontak berhasil diperbarui (Lokal)!', 'success');
      fetchAndApplyConfig(); // Immediately update public links on page
      
      const overlay = document.getElementById('drawer-overlay');
      const drawer = document.getElementById('admin-drawer');
      overlay?.classList.remove('active');
      drawer?.classList.remove('active');
    } catch {
      showToast('Gagal menyimpan konfigurasi.', 'error');
    }
  });
}
