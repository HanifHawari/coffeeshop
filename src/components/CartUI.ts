import { cart, updateQuantity, subscribeCart, clearCart } from '../store/cartStore';
import { formatCurrency, showToast } from '../utils/helpers';

export function initCartUI() {
  subscribeCart(renderCartUI);
  renderCartUI();
  setupOrderSubmission();
}

function renderCartUI() {
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartFooter = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  const floatCartCount = document.getElementById('float-cart-count');
  const totalPriceEl = document.getElementById('cart-total-price');

  const totalItems = cart.reduce((acc, curr) => acc + curr.item.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);

  if (cartCount) cartCount.innerText = totalItems.toString();
  if (floatCartCount) floatCartCount.innerText = totalItems.toString();
  if (totalPriceEl) totalPriceEl.innerText = formatCurrency(totalPrice);

  if (totalItems === 0) {
    cartEmptyState?.classList.remove('hidden');
    cartItemsList?.classList.add('hidden');
    cartFooter?.classList.add('hidden');
    return;
  }

  cartEmptyState?.classList.add('hidden');
  cartItemsList?.classList.remove('hidden');
  cartFooter?.classList.remove('hidden');

  if (cartItemsList) {
    cartItemsList.innerHTML = '';
    cart.forEach((entry, idx) => {
      const itemRow = document.createElement('div');
      itemRow.className = 'flex items-center gap-4 bg-surface-container-low p-3.5 rounded-xl border border-outline/10 hover:border-outline/25 transition-colors';
      itemRow.innerHTML = `
        <img src="${entry.img}" alt="${entry.item.name}" class="w-16 h-16 object-cover rounded-lg" />
        <div class="flex-1 min-w-0">
          <h4 class="font-bold text-primary truncate text-body-lg">${entry.item.name}</h4>
          <p class="text-secondary font-bold text-body-md">${formatCurrency(entry.item.price)}</p>
        </div>
        <div class="flex items-center gap-2">
          <button class="w-7 h-7 bg-surface-container rounded flex items-center justify-center text-primary hover:bg-outline-variant/30 transition-colors cursor-pointer btn-dec" data-index="${idx}">-</button>
          <span class="font-bold text-body-lg text-primary px-1">${entry.item.quantity}</span>
          <button class="w-7 h-7 bg-surface-container rounded flex items-center justify-center text-primary hover:bg-outline-variant/30 transition-colors cursor-pointer btn-inc" data-index="${idx}">+</button>
        </div>
      `;

      itemRow.querySelector('.btn-dec')?.addEventListener('click', () => {
        updateQuantity(idx, entry.item.quantity - 1);
      });

      itemRow.querySelector('.btn-inc')?.addEventListener('click', () => {
        updateQuantity(idx, entry.item.quantity + 1);
      });

      cartItemsList.appendChild(itemRow);
    });
  }
}

function setupOrderSubmission() {
  const orderForm = document.getElementById('order-form');
  orderForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm as HTMLFormElement);
    const customerName = formData.get('customerName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    
    // Calculate total price
    const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);
    const orderItems = cart.map(entry => entry.item);

    const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span> Mengirimkan Pesanan...`;

    try {
      // Mock Saving Order (to be replaced by Supabase in Phase 2)
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      // We will save to localStorage for now so Admin can see it
      const savedOrders = JSON.parse(localStorage.getItem('mockOrders') || '[]');
      savedOrders.unshift({
        id: 'TR-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerName,
        whatsapp,
        email: formData.get('email') as string,
        notes: formData.get('notes') as string,
        items: orderItems,
        totalPrice,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });
      localStorage.setItem('mockOrders', JSON.stringify(savedOrders));

      showToast('Pesanan berhasil disimpan secara lokal! (Fase 1)', 'success');
      
      clearCart();
      (orderForm as HTMLFormElement).reset();
      
      const overlay = document.getElementById('drawer-overlay');
      const drawer = document.getElementById('cart-drawer');
      overlay?.classList.remove('active');
      drawer?.classList.remove('active');

      setTimeout(() => {
        alert(`Terima kasih ${customerName}!\nPesanan Anda telah tersimpan dengan total ${formatCurrency(totalPrice)}.\nAdmin kami akan menghubungi Anda melalui WhatsApp.`);
      }, 500);

    } catch (err) {
      showToast('Gagal mengirim pesanan, coba lagi.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}
