---
name: backend
description: Modifying backend interactions, API calls, and Supabase integration.
---

# Backend Skill

## Kapan Skill Digunakan
Gunakan skill ini saat perlu menambahkan atau mengubah interaksi dengan database atau authentication melalui Supabase, atau membuat panggilan API ke external services.

## File yang Harus Diperiksa Sebelum Coding
1.  `src/api/supabase.ts` - Konfigurasi dan inisialisasi client Supabase.
2.  `src/api/*.ts` (seperti `orderApi.ts`, `configApi.ts`) - Untuk mengecek apakah fungsi API sudah tersedia.
3.  `.env` - Untuk memastikan environment variables Supabase tersedia.

## Workflow Implementasi
1.  Cek ketersediaan fungsi di folder `src/api/`. Jika menambah fitur baru, buat file terpisah atau tambahkan ke file yang sesuai di sana.
2.  Selalu gunakan `try...catch` block untuk menangani kemungkinan error network atau response error dari Supabase.
3.  Gunakan `supabase.from('table_name')` untuk query database.

## Aturan Khusus
*   Kembalikan struktur data yang bersih (dengan interface di `src/types/index.ts`) atau nilai boolean untuk status keberhasilan, jangan melempar error langsung ke UI components tanpa penanganan.

## Hal yang Dilarang
*   **DILARANG KERAS** mengarang API endpoints internal (seperti `/api/orders`). Project ini **TIDAK** menggunakan Node.js backend/Express. Semua request backend adalah query langsung dari frontend ke Supabase.
*   Jangan mengekspos Supabase Service Role Key (hanya gunakan Anon Key).

## Cara Melakukan Verification
*   Cek apakah data berhasil dibaca/ditulis dengan melihat Network tab di DevTools.
*   Jika fitur admin, lakukan login dan lihat apakah data berubah di Dashboard.

## Definition of Done
*   Fungsi API mengembalikan data sesuai interface TypeScript yang ditentukan.
*   Error tertangkap dan ditangani (tidak memecah aplikasi).
