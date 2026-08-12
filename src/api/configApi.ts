import type { ContactConfig } from '../types';
import { supabase } from './supabase';

const DEFAULT_CONFIG: ContactConfig = {
  whatsapp: 'https://wa.me/628123456789?text=Halo%20Kopi%20josjis',
  maps: 'https://maps.google.com/?q=The+Quiet+Ritual+Coffee+Roasters',
  instagram: 'https://instagram.com/thequietritual',
  email: 'info@thequietritual.com',
  phone: 'tel:+628123456789',
  address: '123 Jalan Ketenangan, Distrik Artisan',
  hours: 'Setiap Hari: 08:00 - 20:00'
};

export async function fetchConfig(): Promise<ContactConfig> {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.warn('Failed to fetch config from Supabase, using default.', error?.message);
      return DEFAULT_CONFIG;
    }
    return data as ContactConfig;
  } catch (error) {
    console.error('Exception fetching config:', error);
    return DEFAULT_CONFIG;
  }
}

export async function saveConfig(newConfig: ContactConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('config')
      .upsert({ id: 1, ...newConfig });
    
    if (error) {
      console.error('Supabase Upsert Error:', error);
      return { success: false, error: error.message || error.details || 'Unknown database error' };
    }
    return { success: true };
  } catch (error: any) {
    console.error('Failed to save config to Supabase:', error);
    return { success: false, error: error.message || 'Network/Server Error' };
  }
}

export async function fetchAndApplyConfig() {
  const config = await fetchConfig();
  
  window.localStorage.setItem('config_whatsapp', config.whatsapp);

  const formatWhatsapp = (wa: string) => {
    if (!wa) return '#';
    let cleaned = wa.replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) cleaned = '62' + cleaned.substring(1);
    return `https://wa.me/${cleaned}`;
  };

  const formatInstagram = (ig: string) => {
    if (!ig) return '#';
    if (ig.startsWith('http')) return ig;
    let cleaned = ig.replace('@', '');
    return `https://instagram.com/${cleaned}`;
  };

  const formatUrl = (url: string) => {
    if (!url) return '#';
    if (!url.startsWith('http')) return `https://${url}`;
    return url;
  };

  const safeOpen = (e: Event, url: string) => {
    e.preventDefault();
    if (url === '#') return;
    try {
      const newWin = window.open(url, '_blank');
      if (!newWin || newWin.closed || typeof newWin.closed === 'undefined') {
        window.location.href = url;
      }
    } catch (err) {
      window.location.href = url;
    }
  };

  const linkMaps = document.getElementById('link-maps') as HTMLAnchorElement;
  if (linkMaps) {
    linkMaps.href = formatUrl(config.maps);
    linkMaps.onclick = (e) => safeOpen(e, formatUrl(config.maps));
  }

  const linkWhatsapp = document.getElementById('link-whatsapp') as HTMLAnchorElement;
  if (linkWhatsapp) {
    linkWhatsapp.href = formatWhatsapp(config.whatsapp);
    linkWhatsapp.onclick = (e) => safeOpen(e, formatWhatsapp(config.whatsapp));
  }

  const linkEmail = document.getElementById('link-email') as HTMLAnchorElement;
  if (linkEmail) linkEmail.href = `mailto:${config.email}`; // mailto doesn't need safeOpen

  const linkInstagram = document.getElementById('link-instagram') as HTMLAnchorElement;
  if (linkInstagram) {
    linkInstagram.href = formatInstagram(config.instagram);
    linkInstagram.onclick = (e) => safeOpen(e, formatInstagram(config.instagram));
  }

  const linkWhatsappIcon = document.getElementById('link-whatsapp-icon') as HTMLAnchorElement;
  if (linkWhatsappIcon) {
    linkWhatsappIcon.href = formatWhatsapp(config.whatsapp);
    linkWhatsappIcon.onclick = (e) => safeOpen(e, formatWhatsapp(config.whatsapp));
  }

  const linkMapsIcon = document.getElementById('link-maps-icon') as HTMLAnchorElement;
  if (linkMapsIcon) {
    linkMapsIcon.href = formatUrl(config.maps);
    linkMapsIcon.onclick = (e) => safeOpen(e, formatUrl(config.maps));
  }


  const footerAddress = document.getElementById('footer-address');
  if (footerAddress) footerAddress.innerText = config.address;

  const footerHours = document.getElementById('footer-hours');
  if (footerHours) footerHours.innerText = config.hours;

  const cfgWhatsapp = document.getElementById('cfg-whatsapp') as HTMLInputElement;
  if (cfgWhatsapp) cfgWhatsapp.value = config.whatsapp;

  const cfgMaps = document.getElementById('cfg-maps') as HTMLInputElement;
  if (cfgMaps) cfgMaps.value = config.maps;

  const cfgInstagram = document.getElementById('cfg-instagram') as HTMLInputElement;
  if (cfgInstagram) cfgInstagram.value = config.instagram;

  const cfgEmail = document.getElementById('cfg-email') as HTMLInputElement;
  if (cfgEmail) cfgEmail.value = config.email;

  const cfgAddress = document.getElementById('cfg-address') as HTMLInputElement;
  if (cfgAddress) cfgAddress.value = config.address;

  const cfgHours = document.getElementById('cfg-hours') as HTMLInputElement;
  if (cfgHours) cfgHours.value = config.hours;
}
