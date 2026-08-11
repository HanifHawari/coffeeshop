import gsap from 'gsap';

export function initLoader(onCompleteCallback?: () => void) {
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  
  if (!loader || !mainContent || !loaderBar || !loaderText) return;

  // Safety fallback: if loader is still visible after 6s, force-hide it
  const safetyFallback = setTimeout(() => {
    forceCompleteLoader();
  }, 6000);

  const forceCompleteLoader = () => {
    clearTimeout(safetyFallback);
    loader.style.opacity = '0';
    loader.style.display = 'none';
    // Remove Tailwind utility classes that may conflict with GSAP on mobile
    mainContent.classList.remove('opacity-0', 'translate-y-4');
    mainContent.style.opacity = '1';
    mainContent.style.transform = 'translateY(0)';
    window.scrollTo(0, 0);
    if (onCompleteCallback) onCompleteCallback();
  };

  const progress = { value: 0 };

  // Animate progress bar width and text value
  gsap.to(progress, {
    value: 100,
    duration: 2,
    ease: "power2.inOut",
    onUpdate: () => {
      loaderBar.style.width = `${progress.value}%`;
      loaderText.innerText = `${Math.round(progress.value)}%`;
    },
    onComplete: () => {
      // Fade out loader after progress completes
      gsap.to(loader, {
        opacity: 0,
        duration: 0.8,
        delay: 0.2,
        onComplete: () => {
          clearTimeout(safetyFallback);
          loader.style.display = 'none';
          
          if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
          }
          window.scrollTo(0, 0);

          // Remove Tailwind classes BEFORE GSAP animates to avoid specificity conflicts on mobile
          mainContent.classList.remove('opacity-0', 'translate-y-4');

          gsap.fromTo(mainContent, 
            { opacity: 0, y: 16 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              onComplete: () => {
                if (onCompleteCallback) onCompleteCallback();
              }
            }
          );
        }
      });
    }
  });
}
