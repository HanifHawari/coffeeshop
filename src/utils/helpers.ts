// Helper to format currency
export function formatCurrency(num: number): string {
  return 'Rp ' + num.toLocaleString('id-ID');
}

// Custom Toast notification helper
export function showToast(message: string, type: 'success' | 'info' | 'error' = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `p-4 rounded-xl shadow-lg border text-sm font-medium flex items-center gap-3 bg-surface pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-300`;
  
  if (type === 'success') {
    toast.classList.add('border-emerald-500/30', 'text-emerald-800');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-emerald-600">check_circle</span>
      <span>${message}</span>
    `;
  } else if (type === 'error') {
    toast.classList.add('border-rose-500/30', 'text-rose-800');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-rose-600">error</span>
      <span>${message}</span>
    `;
  } else {
    toast.classList.add('border-outline/30', 'text-primary');
    toast.innerHTML = `
      <span class="material-symbols-outlined text-secondary">info</span>
      <span>${message}</span>
    `;
  }

  container.appendChild(toast);

  // Animate toast entrance
  setTimeout(() => {
    toast.classList.remove('translate-y-2', 'opacity-0');
  }, 10);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4000);
}

/**
 * Custom confirmation dialog — pengganti confirm() bawaan browser.
 * Menampilkan modal bergaya website dengan tombol Konfirmasi & Batal.
 * @returns Promise<boolean> — true jika user klik Konfirmasi, false jika Batal/tutup.
 */
export function showConfirm(options: {
  title: string;
  message: string;
  confirmText?: string;
  confirmClass?: string;
  icon?: string;
  iconClass?: string;
}): Promise<boolean> {
  return new Promise((resolve) => {
    const {
      title,
      message,
      confirmText = 'Konfirmasi',
      confirmClass = 'bg-primary hover:bg-primary/90 text-white',
      icon = 'help',
      iconClass = 'text-primary',
    } = options;

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm opacity-0 transition-opacity duration-200';

    overlay.innerHTML = `
      <div id="confirm-modal-panel" class="bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 w-full max-w-sm p-6 flex flex-col gap-5 transform scale-95 opacity-0 transition-all duration-200">
        <div class="flex items-start gap-4">
          <div class="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0">
            <span class="material-symbols-outlined text-2xl ${iconClass}">${icon}</span>
          </div>
          <div>
            <h3 class="font-bold text-primary text-lg font-display-lg leading-tight">${title}</h3>
            <p class="text-sm text-on-surface-variant mt-1 leading-relaxed">${message}</p>
          </div>
        </div>
        <div class="flex gap-3 justify-end">
          <button id="confirm-cancel-btn" class="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface-variant font-semibold text-sm hover:bg-surface-container transition-colors cursor-pointer">
            Batal
          </button>
          <button id="confirm-ok-btn" class="px-5 py-2.5 rounded-lg font-bold text-sm cursor-pointer transition-colors ${confirmClass}">
            ${confirmText}
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    const panel = overlay.querySelector('#confirm-modal-panel') as HTMLElement;

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.remove('opacity-0');
      panel.classList.remove('scale-95', 'opacity-0');
    });

    const close = (result: boolean) => {
      overlay.classList.add('opacity-0');
      panel.classList.add('scale-95', 'opacity-0');
      setTimeout(() => {
        overlay.remove();
        resolve(result);
      }, 200);
    };

    overlay.querySelector('#confirm-ok-btn')?.addEventListener('click', () => close(true));
    overlay.querySelector('#confirm-cancel-btn')?.addEventListener('click', () => close(false));

    // Klik di luar modal = batal
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });

    // ESC = batal
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { document.removeEventListener('keydown', onKeyDown); close(false); }
    };
    document.addEventListener('keydown', onKeyDown);
  });
}
