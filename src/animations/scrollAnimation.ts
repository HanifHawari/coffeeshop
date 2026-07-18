import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
  // Hero section animation
  gsap.from('.hero-content > *', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out",
    delay: 1.2
  });

  gsap.from('.hero-image', {
    x: 30,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out",
    delay: 1.5
  });

  // About Section Slide In
  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
    },
    x: -50,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  gsap.from('.about-content > *', {
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%',
    },
    x: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
  });

  // Menu cards stagger
  gsap.from('.menu-header > *', {
    scrollTrigger: {
      trigger: '#menu',
      start: 'top 85%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
  });

  const menuGrid = document.querySelector('#menu-scroll-container');
  if (menuGrid) {
    // We only animate the cards inside the container
    const menuItems = gsap.utils.toArray('.menu-card');
    
    const menuTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#menu',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      }
    });

    menuTl.from(menuItems, {
      y: (_: number, target: HTMLElement) => {
        const gridRect = menuGrid.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        return (gridRect.top + gridRect.height / 2) - (targetRect.top + targetRect.height / 2);
      },
      scale: 0.3,
      opacity: 0,
      rotation: () => Math.random() * 30 - 15,
      transformOrigin: "center center",
      stagger: 0,
      ease: "power2.out"
    });
  }


  // Gallery Sticky Stacking / Unravel Reveal
  gsap.from('.gallery-header > *', {
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 85%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
  });

  const galleryGrid = document.querySelector('#gallery .grid');
  if (galleryGrid) {
    const galleryItems = gsap.utils.toArray('.gallery-item');
    
    // We create a ScrollTrigger timeline with scrub so it unravels exactly as user scrolls
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#gallery',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5, // Smooth scrub
      }
    });

    tl.from(galleryItems, {
      x: (_: number, target: HTMLElement) => {
        const gridRect = galleryGrid.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        // Distance to center X
        return (gridRect.left + gridRect.width / 2) - (targetRect.left + targetRect.width / 2);
      },
      y: (_: number, target: HTMLElement) => {
        const gridRect = galleryGrid.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        // Distance to center Y
        return (gridRect.top + gridRect.height / 2) - (targetRect.top + targetRect.height / 2);
      },
      scale: 0.3,
      opacity: 0,
      rotation: () => Math.random() * 60 - 30, // Messy stacked rotation
      transformOrigin: "center center",
      stagger: 0.05,
      ease: "power2.out"
    });
  }
  
  // Footer fade in
  gsap.from('.footer-content > *', {
    scrollTrigger: {
      trigger: 'footer',
      start: 'top 90%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1
  });

  // Parallax effect for hero image
  gsap.to('.hero-image img', {
    scrollTrigger: {
      trigger: '.hero-image',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    y: 50,
    ease: "none"
  });
}
