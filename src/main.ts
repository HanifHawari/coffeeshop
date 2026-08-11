import './style.css';
import { initNavbar } from './animations/navbar';
import { initScrollAnimations } from './animations/scrollAnimation';
import { initCarousel } from './animations/carousel';
import { initInfiniteMenu } from './components/InfiniteMenu';
import gsap from 'gsap';

import { initCartUI } from './components/CartUI';
import { injectOrderButtons } from './components/MenuUI';
import { fetchAndApplyConfig } from './api/configApi';
import { setupNavigationListeners } from './utils/navigation';

const initApp = () => {
  initScrollAnimations();
  initNavbar();
  // Load custom backend components
  fetchAndApplyConfig();
  
  // Render dynamic infinite menu first
  initInfiniteMenu('infinite-menu-container', 30);
  // Then inject order buttons into the rendered cards
  injectOrderButtons();
  
  initCarousel();
  
  setupNavigationListeners();
  
  initCartUI();

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
};

// Initial Launch sequence
if (document.readyState !== 'loading') {
  initApp();
} else {
  document.addEventListener('DOMContentLoaded', initApp);
}
