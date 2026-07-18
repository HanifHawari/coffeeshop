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

  // Menu Carousel Logic
  const menuContainer = document.getElementById('menu-scroll-container');
  const btnPrev = document.getElementById('menu-prev-btn');
  const btnNext = document.getElementById('menu-next-btn');

  if (menuContainer && btnPrev && btnNext) {
    const scrollAmount = 350; // approximate width of a menu card + gap
    
    // We want a seamless infinite scroll.
    // 1. Get original children and the width of one set.
    const originalChildren = Array.from(menuContainer.children);
    const originalScrollWidth = menuContainer.scrollWidth;
    
    // 2. Clone the set TWICE so we have 3 sets total: [Original, Clone 1, Clone 2]
    // This gives us plenty of room to scroll in both directions before teleporting.
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true);
      menuContainer.appendChild(clone);
    });
    const jumpWidth = menuContainer.scrollWidth - originalScrollWidth; // The exact width of one set including gap
    
    originalChildren.forEach(child => {
      const clone = child.cloneNode(true);
      menuContainer.appendChild(clone);
    });

    // 3. Start in the middle set (Clone 1)
    // We use a small timeout to let the browser render the clones first.
    setTimeout(() => {
      menuContainer.scrollLeft = jumpWidth;
    }, 100);

    // 4. Handle prev/next buttons
    btnPrev.addEventListener('click', () => {
      // Teleport if we are too close to the left edge to allow a full scroll
      if (menuContainer.scrollLeft < scrollAmount) {
        menuContainer.style.scrollBehavior = 'auto'; // disable smooth scroll for teleport
        menuContainer.scrollLeft += jumpWidth;
      }
      
      // Re-enable smooth scrolling for the actual movement
      setTimeout(() => {
        menuContainer.style.scrollBehavior = 'smooth';
        menuContainer.scrollBy({ left: -scrollAmount });
        // Reset scrollBehavior so we don't interfere with CSS
        setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
      }, 10);
    });
    
    btnNext.addEventListener('click', () => {
      // Teleport if we are too close to the right edge
      if (menuContainer.scrollLeft > menuContainer.scrollWidth - menuContainer.clientWidth - scrollAmount) {
        menuContainer.style.scrollBehavior = 'auto';
        menuContainer.scrollLeft -= jumpWidth;
      }
      
      setTimeout(() => {
        menuContainer.style.scrollBehavior = 'smooth';
        menuContainer.scrollBy({ left: scrollAmount });
        setTimeout(() => { menuContainer.style.scrollBehavior = ''; }, 500);
      }, 10);
    });

    // 5. Handle user manual scrolling (touchpad, mobile swipe)
    menuContainer.addEventListener('scroll', () => {
      // If user scrolls past the first set, teleport forward
      if (menuContainer.scrollLeft <= 0) {
        menuContainer.scrollLeft += jumpWidth;
      } 
      // If user scrolls past the third set, teleport backward
      else if (menuContainer.scrollLeft >= menuContainer.scrollWidth - menuContainer.clientWidth) {
        menuContainer.scrollLeft -= jumpWidth;
      }
    });

    // 6. Auto-scroll logic (Continuous Marquee Style)
    let animationFrameId: number;
    let resumeTimeout: ReturnType<typeof setTimeout>;
    let isAutoPlaying = false;

    const startAutoPlay = () => {
      stopAutoPlay();
      // Only enable auto-play on desktop
      if (window.innerWidth <= 768) return;
      
      isAutoPlaying = true;
      // Disable CSS snapping while auto-playing to prevent jitter
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
      // Re-enable CSS snapping for manual user scroll
      menuContainer.style.scrollSnapType = 'x mandatory';
    };

    const pauseAutoPlay = () => {
      stopAutoPlay();
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        startAutoPlay();
      }, 30000); // Resume after 30 seconds of inactivity
    };

    // Start auto-play initially
    startAutoPlay();

    // Pause on interactions
    menuContainer.addEventListener('touchstart', pauseAutoPlay);
    menuContainer.addEventListener('mousedown', pauseAutoPlay);
    menuContainer.addEventListener('wheel', pauseAutoPlay);
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
