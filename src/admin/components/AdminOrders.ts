import { fetchOrders, updateOrderStatus } from '../../api/orderApi';
import { formatCurrency, showToast } from '../../utils/helpers';

export async function renderAdminOrders() {
  const emptyState = document.getElementById('admin-orders-empty');
  const listEl = document.getElementById('admin-orders-list');
  const refreshBtn = document.getElementById('refresh-orders-btn');
  
  if (!listEl || !emptyState) return;

  // Setup refresh button
  if (refreshBtn && !refreshBtn.dataset.bound) {
    refreshBtn.dataset.bound = 'true';
    refreshBtn.addEventListener('click', async () => {
      const origHtml = refreshBtn.innerHTML;
      refreshBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Memuat...';
      await renderAdminOrders();
      refreshBtn.innerHTML = origHtml;
      showToast('Data pesanan diperbarui', 'success');
    });
  }

  try {
    const orders = await fetchOrders();

    if (orders.length === 0) {
      emptyState.classList.remove('hidden');
      listEl.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.innerHTML = '';

    orders.forEach((order) => {
      const dateText = new Date(order.createdAt).toLocaleString('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
      });

      const orderCard = document.createElement('div');
      orderCard.className = `p-5 rounded-xl border bg-surface space-y-4 transition-all duration-300 hover:shadow-md ${
        order.status === 'completed' ? 'border-emerald-500/20 bg-emerald-500/5' : 
        order.status === 'cancelled' ? 'border-rose-500/20 bg-rose-500/5' : 'border-outline-variant'
      }`;

      const itemsHtml = order.items.map(item => `
        <div class="flex justify-between text-sm py-1">
          <span class="text-primary font-medium">${item.name} <span class="text-secondary font-bold ml-1">x${item.quantity}</span></span>
          <span class="font-bold text-primary">${formatCurrency(item.price * item.quantity)}</span>
        </div>
      `).join('');

      const statusBadge = 
        order.status === 'completed' ? `<span class="bg-emerald-600 text-white text-[12px] font-bold px-3 py-1 rounded-full">Selesai</span>` :
        order.status === 'cancelled' ? `<span class="bg-rose-600 text-white text-[12px] font-bold px-3 py-1 rounded-full">Batal</span>` :
        `<span class="bg-amber-600 text-white text-[12px] font-bold px-3 py-1 rounded-full animate-pulse">Menunggu</span>`;

      orderCard.innerHTML = `
        <div class="flex justify-between items-start border-b border-outline-variant/35 pb-3">
          <div>
            <span class="text-xs font-bold font-mono text-outline mb-1 block">${order.id}</span>
            <h4 class="font-bold text-primary text-xl font-display-lg">${order.customerName}</h4>
            <p class="text-xs text-on-surface-variant flex items-center gap-1 mt-1">
                <span class="material-symbols-outlined text-[14px]">schedule</span> ${dateText}
            </p>
          </div>
          <div>
            ${statusBadge}
          </div>
        </div>
        <div class="space-y-1 py-2">
          ${itemsHtml}
        </div>
        <div class="flex justify-between items-center pt-3 border-t border-outline-variant/35 text-primary">
          <span class="text-sm font-bold text-on-surface-variant">Total Pesanan</span>
          <span class="font-bold text-2xl text-secondary">${formatCurrency(order.totalPrice)}</span>
        </div>
        ${order.notes ? `
          <div class="bg-surface-container/60 p-3 rounded-lg text-sm text-on-surface-variant italic mt-3 border border-outline-variant/30">
            <strong class="text-primary not-italic block mb-1">Catatan Pelanggan:</strong> ${order.notes}
          </div>
        ` : ''}
        
        <div class="flex gap-3 text-sm mt-4 pt-2">
          ${order.status === 'pending' ? `
            <button class="flex-1 bg-primary text-white py-2.5 rounded-lg font-bold cursor-pointer hover:bg-primary-container transition-colors btn-complete flex items-center justify-center gap-2 shadow-sm" data-id="${order.id}">
                <span class="material-symbols-outlined text-[18px]">check_circle</span> Selesai
            </button>
            <button class="bg-surface border border-outline-variant hover:bg-rose-600 hover:text-white hover:border-rose-600 text-rose-600 px-4 py-2.5 rounded-lg font-bold cursor-pointer transition-colors btn-cancel flex items-center gap-2" data-id="${order.id}">
                <span class="material-symbols-outlined text-[18px]">cancel</span> Batal
            </button>
          ` : ''}
        </div>
      `;

      orderCard.querySelector('.btn-complete')?.addEventListener('click', async () => {
        await handleUpdateStatus(order.id, 'completed');
      });

      orderCard.querySelector('.btn-cancel')?.addEventListener('click', async () => {
        if (confirm('Yakin ingin membatalkan pesanan ini?')) {
          await handleUpdateStatus(order.id, 'cancelled');
        }
      });

      listEl.appendChild(orderCard);
    });
  } catch (err) {
    console.error('Failed to load orders inside admin:', err);
    showToast('Gagal memuat pesanan', 'error');
  }
}

async function handleUpdateStatus(id: string, status: 'completed' | 'cancelled') {
  try {
    const success = await updateOrderStatus(id, status);
    if (success) {
      showToast(`Status pesanan diperbarui menjadi ${status === 'completed' ? 'Selesai' : 'Batal'}.`, 'success');
      renderAdminOrders();
    } else {
      throw new Error();
    }
  } catch {
    showToast('Gagal memperbarui status pesanan', 'error');
  }
}
