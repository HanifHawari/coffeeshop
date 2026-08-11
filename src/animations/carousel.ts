import gsap from 'gsap';

export function initCarousel() {
  const slider = document.querySelector('.testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  if (slider && slides.length > 1) {
    let currentSlide = 0;

    setInterval(() => {
      currentSlide = (currentSlide + 1) % slides.length;
      gsap.to(slider, {
        x: `-${currentSlide * 100}%`,
        duration: 1,
        ease: "power2.inOut"
      });
    }, 5000);
  }

  // Menu Carousel Logic — simple scrollBy, no DOM cloning
  const menuContainer = document.getElementById('menu-scroll-container');
  const btnPrev = document.getElementById('menu-prev-btn');
  const btnNext = document.getElementById('menu-next-btn');

  if (!menuContainer || !btnPrev || !btnNext) return;

  // Get card width dynamically after render
  const getScrollAmount = () => {
    const firstCard = menuContainer.querySelector('.menu-card') as HTMLElement;
    if (!firstCard) return 350;
    return firstCard.offsetWidth + 32; // card width + gap (gap-8 = 2rem = 32px)
  };

  btnPrev.addEventListener('click', () => {
    menuContainer.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  btnNext.addEventListener('click', () => {
    menuContainer.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  // Auto-scroll: desktop only, continuous slow drift, wraps around
  let animationFrameId: number;
  let isAutoPlaying = false;

  const startAutoPlay = () => {
    if (isAutoPlaying || window.innerWidth <= 768) return;
    isAutoPlaying = true;
    menuContainer.style.scrollSnapType = 'none';

    const loop = () => {
      if (!isAutoPlaying) return;

      // Wrap: when near end, jump back to start seamlessly
      if (menuContainer.scrollLeft >= menuContainer.scrollWidth - menuContainer.clientWidth - 5) {
        menuContainer.scrollLeft = 0;
      } else {
        menuContainer.scrollLeft += 0.8;
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

  // Pause auto-play on user interaction, resume after idle
  let resumeTimer: ReturnType<typeof setTimeout>;
  const handleInteraction = () => {
    stopAutoPlay();
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAutoPlay, 3000);
  };

  menuContainer.addEventListener('touchstart', handleInteraction, { passive: true });
  menuContainer.addEventListener('mousedown', handleInteraction);
  btnPrev.addEventListener('click', handleInteraction);
  btnNext.addEventListener('click', handleInteraction);

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
      stopAutoPlay();
    } else if (!isAutoPlaying) {
      startAutoPlay();
    }
  });
}
