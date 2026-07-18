import './style.css';
import { initNavbar } from './animations/navbar';
import { initLoader } from './animations/loader';
import { initScrollAnimations } from './animations/scrollAnimation';
import { initCarousel } from './animations/carousel';
import gsap from 'gsap';

// TypeScript Interfaces matches backend/db.ts
interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface Order {
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

interface ContactConfig {
  whatsapp: string;
  maps: string;
  instagram: string;
  email: string;
  phone: string;
  address: string;
  hours: string;
}

// Global Frontend State
let cart: { item: OrderItem; img: string }[] = [];

// Helper to format currency
function formatCurrency(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Custom Toast notification helper
function showToast(message: string, type: 'success' | 'info' | 'error' = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 bg-surface pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300`;
  
  if (type === 'success') {
    toast.classList.add('border-emerald-500/30', 'text-emerald-800');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-emerald-600">check_circle</span>
      <span>${message}</span>
    `;
  } else if (type === 'error') {
    toast.classList.add('border-rose-500/30', 'text-rose-800');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-rose-600">error</span>
      <span>${message}</span>
    `;
  } else {
    toast.classList.add('border-outline/30', 'text-primary');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-secondary">info</span>
      <span>${message}</span>
    `;
  }

  container.appendChild(toast);

  // Animate toast entrance
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

// Fetch and apply dynamic config links
async function fetchAndApplyConfig() {
  try {
    const res = await fetch('/api/config');
    if (!res.ok) throw new Error();
    const config: ContactConfig = await res.json();

    // Apply config links to DOM elements
    const linkMaps = document.getElementById('link-maps') as HTMLAnchorElement;
    if (linkMaps) linkMaps.href = config.maps;

    const linkWhatsapp = document.getElementById('link-whatsapp') as HTMLAnchorElement;
    if (linkWhatsapp) linkWhatsapp.href = config.whatsapp;

    const linkEmail = document.getElementById('link-email') as HTMLAnchorElement;
    if (linkEmail) linkEmail.href = `mailto:${config.email}`;

    const linkInstagram = document.getElementById('link-instagram') as HTMLAnchorElement;
    if (linkInstagram) linkInstagram.href = config.instagram;

    const linkWhatsappIcon = document.getElementById('link-whatsapp-icon') as HTMLAnchorElement;
    if (linkWhatsappIcon) linkWhatsappIcon.href = config.whatsapp;

    const linkMapsIcon = document.getElementById('link-maps-icon') as HTMLAnchorElement;
    if (linkMapsIcon) linkMapsIcon.href = config.maps;

    const floatWhatsappBtn = document.getElementById('float-whatsapp-btn') as HTMLAnchorElement;
    if (floatWhatsappBtn) floatWhatsappBtn.href = config.whatsapp;

    // Apply text content
    const footerAddress = document.getElementById('footer-address');
    if (footerAddress) footerAddress.innerText = config.address;

    const footerHours = document.getElementById('footer-hours');
    if (footerHours) footerHours.innerText = config.hours;

    // Populate admin config inputs if they exist
    const cfgWhatsapp = document.getElementById('cfg-whatsapp') as HTMLInputElement;
    if (cfgWhatsapp) cfgWhatsapp.value = config.whatsapp;

    const cfgMaps = document.getElementById('cfg-maps') as HTMLInputElement;
    if (cfgMaps) cfgMaps.value = config.maps;

    const cfgInstagram = document.getElementById('cfg-instagram') as HTMLInputElement;
    if (cfgInstagram) cfgInstagram.value = config.instagram;

    const cfgEmail = document.getElementById('cfg-email') as HTMLInputElement;
    if (cfgEmail) cfgEmail.value = config.email;

    const cfgAddress = document.getElementById('cfg-address') as HTMLInputElement;
    if (cfgAddress) cfgAddress.value = config.address;

    const cfgHours = document.getElementById('cfg-hours') as HTMLInputElement;
    if (cfgHours) cfgHours.value = config.hours;

  } catch (error) {
    console.error('Failed to load contact config:', error);
  }
}

// Inject Order Buttons into menu cards dynamically
function injectOrderButtons() {
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach((card, index) => {
    const titleEl = card.querySelector('h3');
    const priceEl = card.querySelector('.absolute.top-2.right-2');
    const imgEl = card.querySelector('img') as HTMLImageElement;

    if (!titleEl || !priceEl) return;

    const title = titleEl.textContent?.trim() || '';
    const priceText = priceEl.textContent?.trim() || '';
    const imageUrl = imgEl ? imgEl.src : '';

    // Parse price e.g. "Rp 35.000" -> 35000
    const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

    // Append dynamic order button if not already added
    if (!card.querySelector('.btn-add-to-cart')) {
      const btn = document.createElement('button');
      btn.className = `w-full mt-4 bg-primary-container text-on-primary font-label-md text-label-md py-2.5 rounded hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 btn-add-to-cart cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95`;
      btn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">local_cafe</span>
        Tambah ke Ritual
      `;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(title, price, imageUrl, btn);
      });
      card.querySelector('.p-6')?.appendChild(btn);
    }

    // Dynamic Steam Particle Animation for warm coffees
    if (index % 3 === 0 && !card.querySelector('.steam-container')) {
      const imgContainer = card.querySelector('.h-48');
      if (imgContainer) {
        const steamContainer = document.createElement('div');
        steamContainer.className = 'steam-container absolute bottom-4 left-6 pointer-events-none flex gap-1.5 z-20';
        steamContainer.innerHTML = `
          <div class="steam-particle w-1 h-8 bg-white/20 rounded-full blur-[1px]"></div>
          <div class="steam-particle w-0.5 h-10 bg-white/20 rounded-full blur-[1px]" style="animation-delay: 1.2s"></div>
          <div class="steam-particle w-1.5 h-7 bg-white/20 rounded-full blur-[1px]" style="animation-delay: 2.4s"></div>
        `;
        imgContainer.appendChild(steamContainer);
      }
    }
  });
}

// Add item to cart with visual feedback animation
function addToCart(name: string, price: number, img: string, buttonElement: HTMLButtonElement) {
  const existing = cart.find(entry => entry.item.name === name);
  if (existing) {
    existing.item.quantity += 1;
  } else {
    cart.push({
      item: { name, price, quantity: 1 },
      img
    });
  }

  // Visual feedback on the card button
  const originalHtml = buttonElement.innerHTML;
  buttonElement.innerHTML = `
    <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
    Menambahkan...
  `;
  buttonElement.classList.remove('bg-primary-container');
  buttonElement.classList.add('bg-secondary');

  setTimeout(() => {
    buttonElement.innerHTML = `
      <span class="material-symbols-outlined text-[18px] text-white">done</span>
      Ditambahkan!
    `;
    setTimeout(() => {
      buttonElement.innerHTML = originalHtml;
      buttonElement.classList.remove('bg-secondary');
      buttonElement.classList.add('bg-primary-container');
    }, 1000);
  }, 400);

  updateCartUI();
  showToast(`Berhasil menambahkan 1x ${name} ke ritual Anda.`, 'success');

  // Bounce animation on floating and navbar cart badges
  const badges = [
    document.getElementById('cart-count'),
    document.getElementById('float-cart-count')
  ];
  badges.forEach(b => {
    if (b) {
      b.classList.remove('badge-pulse');
      void b.offsetWidth; // Force reflow
      b.classList.add('badge-pulse');
    }
  });
}

// Update Cart UI list, totals, and state visibility
function updateCartUI() {
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartItemsList = document.getElementById('cart-items-list');
  const cartFooter = document.getElementById('cart-footer');
  const cartCount = document.getElementById('cart-count');
  const floatCartCount = document.getElementById('float-cart-count');
  const totalPriceEl = document.getElementById('cart-total-price');

  const totalItems = cart.reduce((acc, curr) => acc + curr.item.quantity, 0);
  const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);

  // Update counts
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

      // Event Listeners inside row
      itemRow.querySelector('.btn-dec')?.addEventListener('click', () => {
        if (entry.item.quantity > 1) {
          entry.item.quantity -= 1;
        } else {
          cart.splice(idx, 1);
        }
        updateCartUI();
      });

      itemRow.querySelector('.btn-inc')?.addEventListener('click', () => {
        entry.item.quantity += 1;
        updateCartUI();
      });

      cartItemsList.appendChild(itemRow);
    });
  }
}

// Slide Panels control
function toggleDrawer(drawerId: string, open: boolean) {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById(drawerId);
  if (!drawer || !overlay) return;

  if (open) {
    overlay.classList.add('active');
    drawer.classList.add('active');
  } else {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  }
}

// Fetch Admin Orders list
async function fetchAdminOrders() {
  const emptyState = document.getElementById('admin-orders-empty');
  const listEl = document.getElementById('admin-orders-list');
  if (!listEl || !emptyState) return;

  try {
    const res = await fetch('/api/orders');
    if (!res.ok) throw new Error();
    const orders: Order[] = await res.json();

    if (orders.length === 0) {
      emptyState.classList.remove('hidden');
      listEl.classList.add('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    listEl.classList.remove('hidden');
    listEl.innerHTML = '';

    orders.forEach(order => {
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

      // Status badges
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

      // Complete order listener
      orderCard.querySelector('.btn-complete')?.addEventListener('click', async () => {
        await updateStatus(order.id, 'completed');
      });

      // Cancel order listener
      orderCard.querySelector('.btn-cancel')?.addEventListener('click', async () => {
        if (confirm('Yakin ingin membatalkan pesanan ini?')) {
          await updateStatus(order.id, 'cancelled');
        }
      });

      listEl.appendChild(orderCard);
    });
  } catch (err) {
    console.error('Failed to load orders inside admin:', err);
  }
}

// Update order status API call
async function updateStatus(id: string, status: 'completed' | 'cancelled') {
  try {
    const res = await fetch(`/api/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      showToast(`Status pesanan ${id} diperbarui menjadi ${status === 'completed' ? 'Selesai' : 'Batal'}.`, 'success');
      fetchAdminOrders();
    } else {
      throw new Error();
    }
  } catch {
    showToast('Gagal memperbarui status pesanan', 'error');
  }
}

// Set up UI Event listeners
function setupListeners() {
  // Navigation / Floating click triggers
  const overlay = document.getElementById('drawer-overlay');
  overlay?.addEventListener('click', () => {
    toggleDrawer('cart-drawer', false);
    toggleDrawer('admin-drawer', false);
  });

  const navCartBtn = document.getElementById('nav-cart-btn');
  navCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', true));

  const floatCartBtn = document.getElementById('float-cart-btn');
  floatCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', true));

  const closeCartBtn = document.getElementById('close-cart-btn');
  closeCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', false));

  const navAdminBtn = document.getElementById('nav-admin-btn');
  navAdminBtn?.addEventListener('click', () => {
    toggleDrawer('admin-drawer', true);
    fetchAdminOrders();
  });

  const closeAdminBtn = document.getElementById('close-admin-btn');
  closeAdminBtn?.addEventListener('click', () => toggleDrawer('admin-drawer', false));

  // Admin tabs switching
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

  // Order Submission Form
  const orderForm = document.getElementById('order-form');
  orderForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(orderForm as HTMLFormElement);
    const customerName = formData.get('customerName') as string;
    const whatsapp = formData.get('whatsapp') as string;
    const email = formData.get('email') as string;
    const notes = formData.get('notes') as string;

    const totalPrice = cart.reduce((acc, curr) => acc + (curr.item.price * curr.item.quantity), 0);
    const orderItems = cart.map(entry => entry.item);

    const submitBtn = document.getElementById('submit-order-btn') as HTMLButtonElement;
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="material-symbols-outlined text-lg animate-spin">sync</span> Mengirimkan Pesanan...`;

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          whatsapp,
          email,
          notes,
          items: orderItems,
          totalPrice
        })
      });

      if (!res.ok) throw new Error();

      // Successfully saved order
      showToast('Pesanan berhasil disimpan di database! Selamat menikmati kopi ritual.', 'success');
      
      // Clear Cart state
      cart = [];
      updateCartUI();
      (orderForm as HTMLFormElement).reset();
      toggleDrawer('cart-drawer', false);

      // Trigger standard order success alert
      setTimeout(() => {
        alert(`Terima kasih ${customerName}!\nPesanan Anda telah tersimpan dengan total ${formatCurrency(totalPrice)}.\nAdmin kami akan menghubungi Anda melalui WhatsApp di nomor ${whatsapp}.`);
      }, 500);

    } catch (err) {
      showToast('Gagal mengirim pesanan, coba lagi.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Config links save form
  const configForm = document.getElementById('config-form');
  configForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cfgWhatsapp = (document.getElementById('cfg-whatsapp') as HTMLInputElement).value;
    const cfgMaps = (document.getElementById('cfg-maps') as HTMLInputElement).value;
    const cfgInstagram = (document.getElementById('cfg-instagram') as HTMLInputElement).value;
    const cfgEmail = (document.getElementById('cfg-email') as HTMLInputElement).value;
    const cfgAddress = (document.getElementById('cfg-address') as HTMLInputElement).value;
    const cfgHours = (document.getElementById('cfg-hours') as HTMLInputElement).value;

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          whatsapp: cfgWhatsapp,
          maps: cfgMaps,
          instagram: cfgInstagram,
          email: cfgEmail,
          address: cfgAddress,
          hours: cfgHours
        })
      });

      if (!res.ok) throw new Error();

      showToast('Konfigurasi info kontak berhasil diperbarui di database!', 'success');
      fetchAndApplyConfig(); // Immediately update public links on page
      toggleDrawer('admin-drawer', false);
    } catch {
      showToast('Gagal menyimpan konfigurasi.', 'error');
    }
  });
}

// Initial Launch sequence
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initScrollAnimations();
  initCarousel();

  // Load custom backend components
  fetchAndApplyConfig();
  injectOrderButtons();
  setupListeners();
  updateCartUI();

  // Subtle interactive parallax mouse animation on Hero Image
  const heroImg = document.querySelector('.hero-image');
  if (heroImg) {
    document.addEventListener('mousemove', (e) => {
      const mouseX = (e.clientX / window.innerWidth - 0.5) * 15;
      const mouseY = (e.clientY / window.innerHeight - 0.5) * 15;
      gsap.to(heroImg, {
        x: mouseX,
        y: mouseY,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  }
});
