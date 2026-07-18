import gsap from 'gsap';

export function initLoader() {
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  const loaderBar = document.getElementById('loader-bar');
  const loaderText = document.getElementById('loader-text');
  
  if (!loader || !mainContent || !loaderBar || !loaderText) return;

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
          loader.style.display = 'none';
          
          if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
          }
          window.scrollTo(0, 0);

          gsap.to(mainContent, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power3.out"
          });
        }
      });
    }
  });
}
