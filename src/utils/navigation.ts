import { fetchAdminOrders } from '../components/AdminUI';

export function toggleDrawer(drawerId: string, open: boolean) {
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

export function setupNavigationListeners() {
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
}
