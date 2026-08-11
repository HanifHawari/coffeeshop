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

  // ─── Menu Scroll ──────────────────────────────────────────────────
  const menuContainer = document.getElementById('menu-scroll-container') as HTMLElement;
  const btnPrev   = document.getElementById('menu-prev-btn')  as HTMLButtonElement;
  const btnNext   = document.getElementById('menu-next-btn')  as HTMLButtonElement;

  if (menuContainer && btnPrev && btnNext) {
    const originalChildren = Array.from(menuContainer.children) as HTMLElement[];
    if (originalChildren.length === 0) return;

    const getCardWidth = () => {
      const firstCard = originalChildren[0];
      return firstCard ? firstCard.offsetWidth + 32 : 352; // 32px = gap-8
    };

    const scrollAmount = () => getCardWidth();

    let interactionTimeout: ReturnType<typeof setTimeout>;
    const pauseForInteraction = () => {
      stopAutoPlay();
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => {
        startAutoPlay();
      }, 600); // 600ms pause to let smooth scroll finish
    };

    btnPrev.addEventListener('click', () => {
      pauseForInteraction();
      menuContainer.style.scrollBehavior = 'smooth';
      if (menuContainer.scrollLeft <= 0) {
        // Jika sudah di paling kiri, lompat ke paling kanan
        menuContainer.scrollLeft = menuContainer.scrollWidth - menuContainer.clientWidth;
      } else {
        menuContainer.scrollBy({ left: -scrollAmount() });
      }
      setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
    });

    btnNext.addEventListener('click', () => {
      pauseForInteraction();
      menuContainer.style.scrollBehavior = 'smooth';
      // -5 sebagai toleransi pembulatan pixel
      if (menuContainer.scrollLeft >= menuContainer.scrollWidth - menuContainer.clientWidth - 5) {
        // Jika sudah di paling kanan, kembali ke paling kiri
        menuContainer.scrollLeft = 0;
      } else {
        menuContainer.scrollBy({ left: scrollAmount() });
      }
      setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
    });

    // Auto-scroll logic
    let animationFrameId: number;
    let isAutoPlaying = false;

    const startAutoPlay = () => {
      stopAutoPlay();
      // Only enable auto-play on desktop
      if (window.innerWidth <= 768) return;
      
      isAutoPlaying = true;
      menuContainer.style.scrollSnapType = 'none';

      const loop = () => {
        if (!isAutoPlaying) return;
        menuContainer.scrollLeft += 1;
        
        // Jika sudah sampai ujung kanan, langsung kembali ke elemen pertama
        if (menuContainer.scrollLeft >= menuContainer.scrollWidth - menuContainer.clientWidth - 1) {
           menuContainer.scrollLeft = 0;
        }
        
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    };

    const stopAutoPlay = () => {
      isAutoPlaying = false;
      cancelAnimationFrame(animationFrameId);
      menuContainer.style.scrollSnapType = 'x mandatory';
    };

    startAutoPlay();

    // Pause briefly on interactions to prevent fighting with manual scroll/buttons
    menuContainer.addEventListener('touchstart', pauseForInteraction, { passive: true });
    menuContainer.addEventListener('mousedown', pauseForInteraction);
    menuContainer.addEventListener('wheel', pauseForInteraction, { passive: true });

    // Handle resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 768) {
        stopAutoPlay();
      } else if (!isAutoPlaying) {
        startAutoPlay();
      }
    });
  }
}
