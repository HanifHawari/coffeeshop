---
name: frontend
description: Modifying general frontend logic, DOM interactions, and state management.
---

# Frontend Skill

## Kapan Skill Digunakan
Gunakan skill ini saat perlu mengubah atau menambahkan logika interaksi UI di browser, melakukan DOM manipulation, menambahkan event listeners, atau mengubah state management lokal aplikasi (misal: cart store).

## File yang Harus Diperiksa Sebelum Coding
1.  `index.html` - Untuk memastikan elemen DOM dan ID/class yang akan dimanipulasi benar-benar ada.
2.  `src/main.ts` - Entry point utama aplikasi dan inisialisasi komponen.
3.  `src/store/*.ts` (seperti `cartStore.ts`) - Jika modifikasi melibatkan state global.
4.  `src/components/*.ts` - Untuk mengecek apakah interaksi serupa sudah ada (hindari duplikasi).

## Workflow Implementasi
1.  Verifikasi elemen di `index.html`.
2.  Tambahkan atau modifikasi fungsi di dalam file komponen yang relevan di `src/components/`.
3.  Gunakan `utils/helpers.ts` jika ada fungsi utility yang bisa digunakan ulang (misal: `showToast`, `formatCurrency`).
4.  Pastikan event listener yang di-bind menangani memory leaks atau dipasang dengan benar melalui event delegation jika elemen dinamis.

## Aturan Khusus
*   Gunakan TypeScript dengan typing yang jelas.
*   Selalu query elemen dengan pengecekan null (`if (element)`).

## Hal yang Dilarang
*   Jangan menambahkan logic di dalam tag `<script>` secara langsung di `index.html`. Semua logic harus ada di `src/`.
*   Jangan membuat implementasi framework-specific (seperti React/Vue hooks) karena ini adalah project Vanilla TS.

## Cara Melakukan Verification
*   Jalankan server lokal (`npm run dev`) jika belum berjalan.
*   Buka aplikasi di browser, cek interaksi elemen.
*   Pastikan tidak ada error di Developer Console browser.

## Definition of Done
*   DOM dimanipulasi sesuai requirement tanpa error `null`.
*   Tidak ada konflik dengan event listeners dari fitur lain.
