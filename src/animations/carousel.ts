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

    // Calculate exact width of one set of cards to prevent "ghost space" bugs
    const getCardWidth = () => {
      const firstCard = originalChildren[0];
      return firstCard ? firstCard.offsetWidth + 32 : 352; // 32px = gap-8
    };

    const getJumpWidth = () => originalChildren.length * getCardWidth();
    
    // Clone the set TWICE so we have 3 sets total: [Original, Clone 1, Clone 2]
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true) as HTMLElement;
      menuContainer.appendChild(clone);
    });
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true) as HTMLElement;
      menuContainer.appendChild(clone);
    });

    // Start in the middle set
    setTimeout(() => {
      menuContainer.scrollLeft = getJumpWidth();
    }, 100);

    const scrollAmount = () => getCardWidth();

    btnPrev.addEventListener('click', () => {
      // Teleport if we are too close to the left edge
      if (menuContainer.scrollLeft < scrollAmount()) {
        menuContainer.style.scrollBehavior = 'auto'; // disable smooth scroll for teleport
        menuContainer.scrollLeft += getJumpWidth();
      }
      setTimeout(() => {
        menuContainer.style.scrollBehavior = 'smooth';
        menuContainer.scrollBy({ left: -scrollAmount() });
        setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
      }, 10);
    });

    btnNext.addEventListener('click', () => {
      // Teleport if we are too close to the right edge
      if (menuContainer.scrollLeft > menuContainer.scrollWidth - menuContainer.clientWidth - scrollAmount()) {
        menuContainer.style.scrollBehavior = 'auto';
        menuContainer.scrollLeft -= getJumpWidth();
      }
      setTimeout(() => {
        menuContainer.style.scrollBehavior = 'smooth';
        menuContainer.scrollBy({ left: scrollAmount() });
        setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
      }, 10);
    });

    // Handle user manual scrolling (touchpad, mobile swipe)
    menuContainer.addEventListener('scroll', () => {
      const jWidth = getJumpWidth();
      if (menuContainer.scrollLeft <= 0) {
        menuContainer.scrollLeft += jWidth;
      } else if (menuContainer.scrollLeft >= menuContainer.scrollWidth - menuContainer.clientWidth) {
        menuContainer.scrollLeft -= jWidth;
      }
    });

    // Auto-scroll logic (Continuous Marquee Style)
    let animationFrameId: number;
    let resumeTimeout: ReturnType<typeof setTimeout>;
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
        animationFrameId = requestAnimationFrame(loop);
      };
      animationFrameId = requestAnimationFrame(loop);
    };

    const stopAutoPlay = () => {
      isAutoPlaying = false;
      cancelAnimationFrame(animationFrameId);
      menuContainer.style.scrollSnapType = 'x mandatory';
    };

    const pauseAutoPlay = () => {
      stopAutoPlay();
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        startAutoPlay();
      }, 30000); // Resume after 30 seconds of inactivity
    };

    startAutoPlay();

    // Pause on interactions
    menuContainer.addEventListener('touchstart', pauseAutoPlay, { passive: true });
    menuContainer.addEventListener('mousedown', pauseAutoPlay);
    menuContainer.addEventListener('wheel', pauseAutoPlay, { passive: true });
    btnPrev.addEventListener('click', pauseAutoPlay);
    btnNext.addEventListener('click', pauseAutoPlay);

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
