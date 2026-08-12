import { fetchAndApplyConfig, saveConfig } from '../../api/configApi';
import type { ContactConfig } from '../../types';
import { showToast } from '../../utils/helpers';

export function setupConfigForm() {
  const configForm = document.getElementById('config-form');
  
  configForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cfgWhatsapp = (document.getElementById('cfg-whatsapp') as HTMLInputElement).value;
    const cfgMaps = (document.getElementById('cfg-maps') as HTMLInputElement).value;
    const cfgInstagram = (document.getElementById('cfg-instagram') as HTMLInputElement).value;
    const cfgEmail = (document.getElementById('cfg-email') as HTMLInputElement).value;
    const cfgAddress = (document.getElementById('cfg-address') as HTMLInputElement).value;
    const cfgHours = (document.getElementById('cfg-hours') as HTMLInputElement).value;

    const newConfig: ContactConfig = {
      whatsapp: cfgWhatsapp,
      maps: cfgMaps,
      instagram: cfgInstagram,
      email: cfgEmail,
      address: cfgAddress,
      hours: cfgHours,
      phone: '' // legacy or unused
    };

    const submitBtn = configForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    const origHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="material-symbols-outlined text-[20px] animate-spin">refresh</span> Menyimpan...';
    submitBtn.disabled = true;

    try {
      const result = await saveConfig(newConfig);
      if (result.success) {
        showToast('Konfigurasi berhasil diperbarui!', 'success');
      } else {
        showToast(`Gagal: ${result.error}`, 'error');
        console.error('Config Error Details:', result.error);
        alert(`Gagal menyimpan ke Supabase:\n${result.error}\n\nPastikan struktur tabel config benar dan RLS policy mengizinkan update.`);
      }
    } catch (err: any) {
      showToast('Gagal menyimpan konfigurasi.', 'error');
    } finally {
      submitBtn.innerHTML = origHtml;
      submitBtn.disabled = false;
    }
  });
}

export async function initConfigForm() {
  try {
    // We use the existing function to fetch current config and populate inputs
    await fetchAndApplyConfig(); 
    
    // In configApi, fetchAndApplyConfig might only populate elements if they exist.
    // Let's manually populate our specific admin inputs from the fetched global state if needed,
    // but the IDs in our admin/index.html match the original ones (cfg-whatsapp, etc).
    // Let's verify configApi actually populated them.
  } catch (err) {
    console.error('Failed to init config form', err);
  }
}
