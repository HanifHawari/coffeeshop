import { cart, updateQuantity, subscribeCart, clearCart } from '../store/cartStore';
import { formatCurrency, showToast } from '../utils/helpers';
import { createOrder } from '../api/orderApi';
import { toggleDrawer } from '../utils/navigation';

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
  const cartCountMobile = document.getElementById('cart-count-mobile');
  const totalPriceEl = document.getElementById('cart-total-price');

  const totalItems = cart.reduce((acc, curr) => acc + curr.item.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);

  if (cartCount) {
    cartCount.innerText = totalItems.toString();
    if (totalItems === 0) cartCount.classList.add('hidden');
    else cartCount.classList.remove('hidden');
  }
  
  if (cartCountMobile) {
    cartCountMobile.innerText = totalItems.toString();
    if (totalItems === 0) cartCountMobile.classList.add('hidden');
    else cartCountMobile.classList.remove('hidden');
  }

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
      const orderId = await createOrder(customerName, whatsapp, email, notes, orderItems, totalPrice);

      if (orderId) {
        showToast('Pesanan berhasil disimpan di database (Supabase)!', 'success');
        
        clearCart();
        (orderForm as HTMLFormElement).reset();
        
        toggleDrawer('cart-drawer', false);

        setTimeout(() => {
          // Show Payment Modal
          document.body.style.overflow = 'hidden';
          const modal = document.getElementById('payment-modal');
          const modalContent = document.getElementById('payment-modal-content');
          const totalText = document.getElementById('payment-total-text');
          const btnWA = document.getElementById('btn-payment-wa') as HTMLAnchorElement;
          const btnClose = document.getElementById('btn-close-payment');
          
          if (modal && modalContent && totalText && btnWA && btnClose) {
            // Retrieve whatsapp config
            const whatsappNumber = window.localStorage.getItem('config_whatsapp') || '628123456789';
            
            totalText.innerText = formatCurrency(totalPrice);
            
            // --- Accordion Logic ---
            const methodRadios = document.querySelectorAll('input[name="payment-method"]');
            const subOptions = document.querySelectorAll('.sub-option input[type="radio"]');
            const subPanels = document.querySelectorAll('.payment-sub-panel');
            const ewalletInfo = document.getElementById('ewallet-qris-info');
            const ewalletNameDisplay = document.getElementById('ewallet-name-display');
            const bankAccountInfo = document.getElementById('bank-account-info');

            let selectedMethod = '';
            let selectedSubOption = '';

            const updateWALink = () => {
              let paymentText = selectedMethod;
              if (selectedSubOption) paymentText += ` (${selectedSubOption})`;
              if (!paymentText) paymentText = 'Belum dipilih';

              const message = `Halo Kopi Josjis,\n\nSaya ingin mengkonfirmasi pesanan saya:\n*Order ID:* ${orderId}\n*Nama:* ${customerName}\n*Total:* ${formatCurrency(totalPrice)}\n*Metode Pembayaran:* ${paymentText}\n\nMohon segera diproses. Terima kasih!`;
              const finalUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
              
              btnWA.href = finalUrl;
              btnWA.onclick = (e) => {
                e.preventDefault();
                console.log('Menuju WA:', finalUrl);
                try {
                  const newWin = window.open(finalUrl, '_blank');
                  if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
                    // Popup blocked! Fallback to same window
                    window.location.href = finalUrl;
                  }
                } catch (err) {
                  window.location.href = finalUrl;
                }
              };
            };

            const hideAllSubPanels = () => {
              subPanels.forEach(panel => panel.classList.add('hidden'));
              if(ewalletInfo) ewalletInfo.classList.add('hidden');
              if(bankAccountInfo) bankAccountInfo.classList.add('hidden');
            };

            methodRadios.forEach(radio => {
              radio.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                selectedMethod = target.value.toUpperCase();
                selectedSubOption = ''; 
                
                document.querySelectorAll('.method-radio-dot').forEach(d => d.classList.remove('scale-100'));
                document.querySelectorAll('.payment-method-group').forEach(g => g.classList.remove('border-primary'));
                const group = target.closest('.payment-method-group');
                if (group) {
                  group.classList.add('border-primary');
                  const dot = group.querySelector('.method-radio-dot');
                  if(dot) dot.classList.add('scale-100');
                }

                hideAllSubPanels();

                if (target.value === 'ewallet') {
                  const p = document.querySelector('.payment-sub-panel:has([data-sub-group="ewallet"])');
                  if (p) p.classList.remove('hidden');
                } else if (target.value === 'bank') {
                  const p = document.querySelector('.payment-sub-panel:has([data-sub-group="bank"])');
                  if (p) p.classList.remove('hidden');
                } else if (target.value === 'cash') {
                  selectedSubOption = 'Bayar di Kasir';
                }

                document.querySelectorAll('.sub-logo-box').forEach(b => b.classList.remove('border-primary'));
                updateWALink();
              });
            });

            subOptions.forEach(sub => {
              sub.addEventListener('change', (e) => {
                const target = e.target as HTMLInputElement;
                selectedSubOption = target.value;
                
                document.querySelectorAll('.sub-logo-box').forEach(b => b.classList.remove('border-primary'));
                const box = target.closest('label')?.querySelector('.sub-logo-box');
                if(box) box.classList.add('border-primary');

                if (target.name === 'sub-ewallet') {
                  if (ewalletInfo && ewalletNameDisplay) {
                    ewalletInfo.classList.remove('hidden');
                    ewalletNameDisplay.innerText = target.value;
                  }
                } else if (target.name === 'sub-bank') {
                  if (bankAccountInfo) {
                    bankAccountInfo.classList.remove('hidden');
                    bankAccountInfo.innerHTML = `Silakan transfer ke rekening <b>${target.value}</b> a.n. Kopi Josjis.`;
                  }
                }

                updateWALink();
              });
            });

            updateWALink(); // Initial Link setup
            
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
                document.body.style.overflow = '';
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
