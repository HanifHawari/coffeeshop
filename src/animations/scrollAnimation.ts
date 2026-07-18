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

  gsap.from('.menu-card', {
    scrollTrigger: {
      trigger: '#menu',
      start: 'top 75%'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: "back.out(1.2)"
  });


  // Gallery stagger
  gsap.from('.gallery-header > *', {
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 85%'
    },
    y: 30,
    opacity: 0,
    duration: 0.8
  });

  gsap.from('.gallery-item', {
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 80%'
    },
    scale: 0.9,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: "power2.out"
  });
  
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
