import gsap from 'gsap';

export function initLoader() {
  const loader = document.getElementById('loader');
  const mainContent = document.getElementById('main-content');
  if (!loader || !mainContent) return;

  setTimeout(() => {
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => {
        loader.style.display = 'none';
        
        gsap.to(mainContent, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        });
      }
    });
  }, 1000);
}
