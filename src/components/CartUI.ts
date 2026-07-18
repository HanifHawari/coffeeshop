import { cart, updateQuantity, subscribeCart, clearCart } from '../store/cartStore';
import { formatCurrency, showToast } from '../utils/helpers';
import { createOrder } from '../api/orderApi';

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
    const email = formData.get('email') as string;
    const notes = formData.get('notes') as string;
    
    // Calculate total price
    const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);
    const orderItems = cart.map(entry => entry.item);

    const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span> Mengirimkan Pesanan...`;

    try {
      const success = await createOrder(customerName, whatsapp, email, notes, orderItems, totalPrice);

      if (success) {
        showToast('Pesanan berhasil disimpan di database (Supabase)!', 'success');
        
        clearCart();
        (orderForm as HTMLFormElement).reset();
        
        const overlay = document.getElementById('drawer-overlay');
        const drawer = document.getElementById('cart-drawer');
        overlay?.classList.remove('active');
        drawer?.classList.remove('active');

        setTimeout(() => {
          // Show Payment Modal
          const modal = document.getElementById('payment-modal');
          const modalContent = document.getElementById('payment-modal-content');
          const totalText = document.getElementById('payment-total-text');
          const btnWA = document.getElementById('btn-payment-wa') as HTMLAnchorElement;
          const btnClose = document.getElementById('btn-close-payment');
          
          if (modal && modalContent && totalText && btnWA && btnClose) {
            // Retrieve whatsapp config
            const whatsappNumber = window.localStorage.getItem('config_whatsapp') || '628123456789';
            
            totalText.innerText = formatCurrency(totalPrice);
            btnWA.href = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=Halo%20Kopi%20Josjis,%20saya%20sudah%20melakukan%20pembayaran%20untuk%20pesanan%20atas%20nama%20${encodeURIComponent(customerName)}%20sebesar%20${encodeURIComponent(formatCurrency(totalPrice))}.%20Berikut%20bukti%20transfernya:`;
            
            modal.classList.remove('hidden');
            modal.classList.add('flex');
            // Animate in
            setTimeout(() => {
              modalContent.classList.remove('scale-95', 'opacity-0');
              modalContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            
            const closeModal = () => {
              modalContent.classList.remove('scale-100', 'opacity-100');
              modalContent.classList.add('scale-95', 'opacity-0');
              setTimeout(() => {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
              }, 300);
            };
            
            btnClose.onclick = closeModal;
          }
        }, 300);
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast('Gagal mengirim pesanan, coba lagi.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
}
