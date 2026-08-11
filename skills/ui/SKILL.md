---
name: ui
description: Modifying HTML structure, Tailwind styling, and GSAP animations.
---

# UI Skill

## Kapan Skill Digunakan
Gunakan skill ini ketika diminta mengubah tampilan, warna, posisi elemen, membuat halaman baru, atau memperbaiki animasi.

## File yang Harus Diperiksa Sebelum Coding
1.  `index.html` - Struktur utama dan markup.
2.  `src/style.css` - Custom CSS variables (menggunakan Tailwind v4 config `theme`).
3.  `tailwind.config.js` / `postcss.config.js` - Walaupun v4, cek jika ada dependensi atau file yang relevan.

## Workflow Implementasi
1.  Cari elemen yang ingin diubah dalam `index.html`.
2.  Gunakan utility class Tailwind.
3.  Jika membuat animasi, tambahkan logic di `src/animations/` atau langsung gunakan GSAP (jangan pakai library animasi lain tanpa izin).

## Aturan Khusus
*   Project ini menggunakan Tailwind CSS versi 4 (`@tailwindcss/postcss`). Cara penggunaannya bisa berbeda dengan versi 3 (mengandalkan CSS variable untuk theme color seperti `bg-primary`, `bg-surface-container`, `text-on-surface`).
*   Perhatikan penggunaan semantic tag HTML5 (`<section>`, `<nav>`, `<main>`, `<article>`).

## Hal yang Dilarang
*   Jangan mengubah file `index.html` secara drastis (misal menghapus ID atau class tertentu) yang diikat oleh `src/components/` tanpa memperbarui TS filenya (misalnya `id="cart-drawer"`, `id="admin-drawer"`, `class="btn-add-to-cart"`).
*   Jangan mengarang class CSS jika sudah ada Tailwind utility classes.

## Cara Melakukan Verification
*   Periksa responsivitas desain pada ukuran layar mobile (md, lg).
*   Pastikan tidak ada class yang "broken".

## Definition of Done
*   UI sesuai dengan deskripsi atau screenshot.
*   Responsif dan rapi.
*   Fungsionalitas JS yang terikat ke elemen UI tetap berjalan (tidak rusak karena perubahan ID).
