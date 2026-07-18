import { addToCart } from '../store/cartStore';
import { showToast } from '../utils/helpers';

export function injectOrderButtons() {
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach((card, index) => {
    const titleEl = card.querySelector('h3');
    const priceEl = card.querySelector('.absolute.top-2.right-2');
    const imgEl = card.querySelector('img') as HTMLImageElement;

    if (!titleEl || !priceEl) return;

    const title = titleEl.textContent?.trim() || '';
    const priceText = priceEl.textContent?.trim() || '';
    const imageUrl = imgEl ? imgEl.src : '';

    const price = parseInt(priceText.replace(/[^0-9]/g, ''), 10) || 0;

    if (!card.querySelector('.btn-add-to-cart')) {
      const btn = document.createElement('button');
      btn.className = `w-full mt-4 bg-primary-container text-on-primary font-label-md text-label-md py-2.5 rounded hover:bg-primary transition-all duration-300 flex items-center justify-center gap-2 btn-add-to-cart cursor-pointer hover:shadow-md hover:scale-[1.02] active:scale-95`;
      btn.innerHTML = `
        <span class="material-symbols-outlined text-[18px]">local_cafe</span>
        Tambah ke Ritual
      `;
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        handleAddCartAction(title, price, imageUrl, btn);
      });
      card.querySelector('.p-6')?.appendChild(btn);
    }

    if (index % 3 === 0 && !card.querySelector('.steam-container')) {
      const imgContainer = card.querySelector('.h-48');
      if (imgContainer) {
        const steamContainer = document.createElement('div');
        steamContainer.className = 'steam-container absolute bottom-4 left-6 pointer-events-none flex gap-1.5 z-20';
        steamContainer.innerHTML = `
          <div class="steam-particle w-1 h-8 bg-white/20 rounded-full blur-[1px]"></div>
          <div class="steam-particle w-0.5 h-10 bg-white/20 rounded-full blur-[1px]" style="animation-delay: 1.2s"></div>
          <div class="steam-particle w-1.5 h-7 bg-white/20 rounded-full blur-[1px]" style="animation-delay: 2.4s"></div>
        `;
        imgContainer.appendChild(steamContainer);
      }
    }
  });
}

function handleAddCartAction(name: string, price: number, img: string, buttonElement: HTMLButtonElement) {
  addToCart(name, price, img);

  const originalHtml = buttonElement.innerHTML;
  buttonElement.innerHTML = `
    <span class="material-symbols-outlined text-[18px] animate-spin">sync</span>
    Menambahkan...
  `;
  buttonElement.classList.remove('bg-primary-container');
  buttonElement.classList.add('bg-secondary');

  setTimeout(() => {
    buttonElement.innerHTML = `
      <span class="material-symbols-outlined text-[18px] text-white">done</span>
      Ditambahkan!
    `;
    setTimeout(() => {
      buttonElement.innerHTML = originalHtml;
      buttonElement.classList.remove('bg-secondary');
      buttonElement.classList.add('bg-primary-container');
    }, 1000);
  }, 400);

  showToast(`Berhasil menambahkan 1x ${name} ke ritual Anda.`, 'success');

  const badges = [
    document.getElementById('cart-count'),
    document.getElementById('float-cart-count')
  ];
  badges.forEach(b => {
    if (b) {
      b.classList.remove('badge-pulse');
      void b.offsetWidth;
      b.classList.add('badge-pulse');
    }
  });
}
