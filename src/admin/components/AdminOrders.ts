import { fetchOrders, updateOrderStatus, clearArchivedOrders } from '../../api/orderApi';
import { formatCurrency, showToast, showConfirm } from '../../utils/helpers';
import type { Order } from '../../types/index';

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

  // Setup clear archive button
  setupClearArchiveButton();

  try {
    const orders = await fetchOrders();

    // Update dashboard stats whenever orders are fetched
    updateDashboardStats(orders);

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
            <div class="flex items-center gap-3 mt-1">
                <p class="text-xs text-on-surface-variant flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">schedule</span> ${dateText}
                </p>
                <p class="text-xs text-on-surface-variant flex items-center gap-1">
                    <span class="material-symbols-outlined text-[14px]">call</span> ${order.whatsapp}
                </p>
            </div>
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
        
        <div class="flex flex-wrap gap-2 text-sm mt-4 pt-2">
          <a href="https://wa.me/${order.whatsapp.replace(/[^0-9]/g, '')}" target="_blank" class="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-sm min-w-[120px]">
              <span class="material-symbols-outlined text-[18px]">chat</span> Hubungi
          </a>
          ${order.status === 'pending' ? `
            <button class="flex-1 bg-primary text-white py-2.5 px-3 rounded-lg font-bold cursor-pointer hover:bg-primary-container transition-colors btn-complete flex items-center justify-center gap-2 shadow-sm min-w-[120px]" data-id="${order.id}">
                <span class="material-symbols-outlined text-[18px]">check_circle</span> Selesai
            </button>
            <button class="bg-surface border border-outline-variant hover:bg-rose-600 hover:text-white hover:border-rose-600 text-rose-600 py-2.5 px-3 rounded-lg font-bold cursor-pointer transition-colors btn-cancel flex items-center justify-center gap-2 min-w-[100px]" data-id="${order.id}">
                <span class="material-symbols-outlined text-[18px]">cancel</span> Batal
            </button>
          ` : ''}
        </div>
      `;

      orderCard.querySelector('.btn-complete')?.addEventListener('click', async () => {
        await handleUpdateStatus(order.id, 'completed');
      });

      orderCard.querySelector('.btn-cancel')?.addEventListener('click', async () => {
        const ok = await showConfirm({
          title: 'Batalkan Pesanan?',
          message: 'Pesanan ini akan ditandai sebagai Dibatalkan. Tindakan ini tidak dapat diubah kembali.',
          confirmText: 'Ya, Batalkan',
          confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: 'cancel',
          iconClass: 'text-rose-500',
        });
        if (ok) {
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

/**
 * Calculates and renders today's order statistics into the dashboard cards.
 */
function updateDashboardStats(orders: Order[]) {
  const statTotalOrders = document.getElementById('stat-total-orders');
  const statTotalRevenue = document.getElementById('stat-total-revenue');
  const statPendingOrders = document.getElementById('stat-pending-orders');

  if (!statTotalOrders || !statTotalRevenue || !statPendingOrders) return;

  const today = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });

  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: '2-digit', day: '2-digit' });
    return orderDate === today;
  });

  const totalRevenue = todayOrders
    .filter(order => order.status !== 'cancelled')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const pendingCount = orders.filter(order => order.status === 'pending').length;

  statTotalOrders.textContent = String(todayOrders.length);
  statTotalRevenue.textContent = formatCurrency(totalRevenue);
  statPendingOrders.textContent = String(pendingCount);
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

/**
 * Mendaftarkan handler untuk tombol "Bersihkan Arsip".
 * Hanya didaftarkan sekali menggunakan pola data-bound.
 */
function setupClearArchiveButton() {
  const clearBtn = document.getElementById('clear-archive-btn') as HTMLButtonElement | null;
  if (!clearBtn || clearBtn.dataset.bound) return;

  clearBtn.dataset.bound = 'true';
  clearBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm({
      title: 'Bersihkan Arsip Pesanan?',
      message: 'Semua pesanan Selesai & Dibatalkan akan dihapus permanen. Pesanan yang masih Menunggu tetap aman. Tindakan ini tidak bisa dibatalkan.',
      confirmText: 'Ya, Hapus Arsip',
      confirmClass: 'bg-rose-600 hover:bg-rose-700 text-white',
      icon: 'delete_sweep',
      iconClass: 'text-rose-500',
    });
    if (!confirmed) return;

    const origHtml = clearBtn.innerHTML;
    clearBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Menghapus...';
    clearBtn.disabled = true;

    const deletedCount = await clearArchivedOrders();

    clearBtn.innerHTML = origHtml;
    clearBtn.disabled = false;

    if (deletedCount === -1) {
      showToast('Gagal membersihkan arsip pesanan.', 'error');
    } else if (deletedCount === 0) {
      showToast('Tidak ada arsip pesanan untuk dihapus.', 'success');
    } else {
      showToast(`${deletedCount} pesanan arsip berhasil dihapus.`, 'success');
      renderAdminOrders();
    }
  });
}
