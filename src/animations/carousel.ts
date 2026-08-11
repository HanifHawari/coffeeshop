import gsap from 'gsap';

export function initCarousel() {
  // ─── Testimonial Slider ────────────────────────────────────────────────────
  const slider = document.querySelector('.testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  if (slider && slides.length > 1) {
    let currentSlide = 0;
    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      gsap.to(slider, { x: `-${currentSlide * 100}%`, duration: 1, ease: 'power2.inOut' });
    }, 5000);
  }

}
