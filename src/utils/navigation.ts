export function toggleDrawer(drawerId: string, open: boolean) {
  const overlay = document.getElementById('drawer-overlay');
  const drawer = document.getElementById(drawerId);
  const navbar = document.getElementById('navbar');
  if (!drawer || !overlay) return;

  if (open) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';
    overlay.classList.add('active');
    drawer.classList.add('active');
  } else {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    if (navbar) navbar.style.paddingRight = '';
    overlay.classList.remove('active');
    drawer.classList.remove('active');
  }
}

export function setupNavigationListeners() {
  const overlay = document.getElementById('drawer-overlay');
  overlay?.addEventListener('click', () => {
    toggleDrawer('cart-drawer', false);
  });

  const navCartBtn = document.getElementById('nav-cart-btn');
  const navCartBtnMobile = document.getElementById('nav-cart-btn-mobile');
  
  navCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', true));
  navCartBtnMobile?.addEventListener('click', () => toggleDrawer('cart-drawer', true));

  const closeCartBtn = document.getElementById('close-cart-btn');
  closeCartBtn?.addEventListener('click', () => toggleDrawer('cart-drawer', false));



  // Mobile Menu Logic
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function toggleMobileMenu(open: boolean) {
    if (!mobileMenu) return;
    const navbar = document.getElementById('navbar');
    
    if (open) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        if (navbar) navbar.style.paddingRight = `${scrollbarWidth}px`;
      }
      document.body.style.overflow = 'hidden';
      
      mobileMenu.classList.remove('translate-x-full');
    } else {
      document.body.style.overflow = '';
      mobileMenu.classList.add('translate-x-full');
      document.body.style.paddingRight = '';
      if (navbar) navbar.style.paddingRight = '';
    }
  }

  mobileMenuBtn?.addEventListener('click', () => toggleMobileMenu(true));
  mobileMenuClose?.addEventListener('click', () => toggleMobileMenu(false));
  
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(false));
  });


}
