import './style.css';
import { initNavbar } from './animations/navbar';
import { initLoader } from './animations/loader';
import { initScrollAnimations } from './animations/scrollAnimation';
import { initCarousel } from './animations/carousel';
import gsap from 'gsap';

import { initCartUI } from './components/CartUI';
import { initAdminUI } from './components/AdminUI';
import { injectOrderButtons } from './components/MenuUI';
import { fetchAndApplyConfig } from './api/configApi';
import { setupNavigationListeners } from './utils/navigation';

// Initial Launch sequence
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  // Load custom backend components
  fetchAndApplyConfig();
  injectOrderButtons();
  
  initCarousel();
  initScrollAnimations();
  
  setupNavigationListeners();
  
  initCartUI();
  initAdminUI();

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
