import { renderAdminOrders } from '../components/AdminUI';

export function toggleDrawer(drawerId: string, open: boolean) {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById(drawerId);
  if (!drawer || !overlay) return;

  const fabContainer = document.getElementById('fab-container');

  if (open) {
    overlay.classList.add('active');
    drawer.classList.add('active');
    if (fabContainer) fabContainer.classList.add('hidden');
  } else {
    overlay.classList.remove('active');
    drawer.classList.remove('active');
    if (fabContainer) fabContainer.classList.remove('hidden');
  }
}

export function setupNavigationListeners() {
  const overlay = document.getElementById('drawer-overlay');
  overlay?.addEventListener('click', () => {
    toggleDrawer('cart-drawer', false);
    toggleDrawer('admin-drawer', false);
  });

  const navCartBtn = document.getElementById('nav-cart-btn');
  const navCartBtnMobile = document.getElementById('nav-cart-btn-mobile');
  
  navCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', true));
  navCartBtnMobile?.addEventListener('click', () => toggleDrawer('cart-drawer', true));

  const floatCartBtn = document.getElementById('float-cart-btn');
  floatCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', true));

  const closeCartBtn = document.getElementById('close-cart-btn');
  closeCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', false));

  const navAdminBtn = document.getElementById('nav-admin-btn');
  navAdminBtn?.addEventListener('click', () => {
    toggleDrawer('admin-drawer', true);
    renderAdminOrders();
  });

  const closeAdminBtn = document.getElementById('close-admin-btn');
  closeAdminBtn?.addEventListener('click', () => toggleDrawer('admin-drawer', false));

  // Desktop Dropdown Logic
  const desktopActionsBtn = document.getElementById('desktop-actions-btn');
  const desktopActionsDropdown = document.getElementById('desktop-actions-dropdown');
  
  if (desktopActionsBtn && desktopActionsDropdown) {
    desktopActionsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      desktopActionsDropdown.classList.toggle('opacity-0');
      desktopActionsDropdown.classList.toggle('invisible');
      desktopActionsDropdown.classList.toggle('scale-95');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!desktopActionsBtn.contains(e.target as Node) && !desktopActionsDropdown.contains(e.target as Node)) {
        desktopActionsDropdown.classList.add('opacity-0', 'invisible', 'scale-95');
      }
    });
    
    // Close dropdown when a link inside is clicked
    desktopActionsDropdown.addEventListener('click', () => {
      desktopActionsDropdown.classList.add('opacity-0', 'invisible', 'scale-95');
    });
  }

  // Mobile Menu Logic
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const mobileAdminBtn = document.getElementById('mobile-admin-btn');

  function toggleMobileMenu(open: boolean) {
    if (!mobileMenu) return;
    const fabContainer = document.getElementById('fab-container');
    const navbar = document.getElementById('navbar');
    
    if (open) {
      const scrollbarWidth = window.innerWidth > 768 ? (window.innerWidth - document.documentElement.clientWidth) : 0;
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
      
      mobileMenu.classList.remove('translate-x-full');
      if (fabContainer) fabContainer.classList.add('hidden');
    } else {
      mobileMenu.classList.add('translate-x-full');
      document.body.style.paddingRight = '';
      if (navbar) navbar.style.paddingRight = '';
      if (fabContainer) fabContainer.classList.remove('hidden');
    }
  }

  mobileMenuBtn?.addEventListener('click', () => toggleMobileMenu(true));
  mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(false));
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });

  mobileAdminBtn?.addEventListener('click', () => {
    toggleMobileMenu(false);
    toggleDrawer('admin-drawer', true);
    renderAdminOrders();
  });
}
