import '../style.css';
import { supabase } from '../api/supabase';
import { renderAdminOrders } from './components/AdminOrders.ts';
import { setupConfigForm, initConfigForm } from './components/AdminConfig.ts';
import { showToast } from '../utils/helpers';

document.addEventListener('DOMContentLoaded', () => {
  setupAuth();
  setupSidebarNavigation();
  setupConfigForm();
});

function setupAuth() {
  const loginForm = document.getElementById('admin-login-form');
  const loginView = document.getElementById('admin-login-view');
  const dashboardView = document.getElementById('admin-dashboard-view');
  const logoutBtn = document.getElementById('admin-logout-btn');
  
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const loginPasswordInput = document.getElementById('login-password') as HTMLInputElement;
  const togglePasswordIcon = document.getElementById('toggle-password-icon');

  togglePasswordBtn?.addEventListener('click', () => {
    if (loginPasswordInput.type === 'password') {
      loginPasswordInput.type = 'text';
      if (togglePasswordIcon) togglePasswordIcon.innerHTML = 'visibility';
    } else {
      loginPasswordInput.type = 'password';
      if (togglePasswordIcon) togglePasswordIcon.innerHTML = 'visibility_off';
    }
  });

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      // Logged in
      loginView?.classList.add('hidden');
      dashboardView?.classList.remove('hidden');
      dashboardView?.classList.add('flex');
      
      // Load initial data
      renderAdminOrders();
      initConfigForm();
    } else {
      // Logged out
      loginView?.classList.remove('hidden');
      dashboardView?.classList.add('hidden');
      dashboardView?.classList.remove('flex');
    }
  });

  // Handle Login
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('login-email') as HTMLInputElement).value;
    const password = (document.getElementById('login-password') as HTMLInputElement).value;
    const submitBtn = document.getElementById('login-submit-btn') as HTMLButtonElement;
    
    const origText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Memproses...';
    submitBtn.disabled = true;

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      showToast('Login berhasil', 'success');
      (loginForm as HTMLFormElement).reset();
    } catch (err: any) {
      showToast(err.message || 'Login gagal. Periksa kembali email dan password.', 'error');
    } finally {
      submitBtn.innerHTML = origText;
      submitBtn.disabled = false;
    }
  });

  // Handle Logout
  logoutBtn?.addEventListener('click', async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      showToast('Berhasil logout', 'success');
    } catch (err: any) {
      showToast('Gagal logout', 'error');
    }
  });
}

function setupSidebarNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  const contents = document.querySelectorAll('.tab-content');
  const mobileToggle = document.getElementById('mobile-sidebar-toggle');
  const sidebarNav = document.getElementById('sidebar-nav');

  // Toggle mobile sidebar
  mobileToggle?.addEventListener('click', () => {
    sidebarNav?.classList.toggle('hidden');
    sidebarNav?.classList.toggle('flex');
  });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => {
        t.classList.remove('active', 'bg-primary/10', 'text-primary', 'font-semibold');
        t.classList.add('text-on-surface-variant', 'font-medium');
      });
      
      // Add active to clicked tab
      tab.classList.add('active', 'bg-primary/10', 'text-primary', 'font-semibold');
      tab.classList.remove('text-on-surface-variant', 'font-medium');

      // Hide all contents
      contents.forEach(c => {
        c.classList.remove('block');
        c.classList.add('hidden');
      });

      // Show target content
      const target = tab.getAttribute('data-target');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.remove('hidden');
        targetContent.classList.add('block');
      }

      // On mobile, hide sidebar after clicking a tab
      if (window.innerWidth < 768) {
        sidebarNav?.classList.add('hidden');
        sidebarNav?.classList.remove('flex');
      }
    });
  });
}
