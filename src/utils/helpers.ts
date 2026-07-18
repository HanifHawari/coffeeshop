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
