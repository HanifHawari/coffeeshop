---
name: database
description: Interacting with verified database tables and schemas.
---

# Database Skill

## Kapan Skill Digunakan
Gunakan skill ini ketika diminta memanipulasi struktur data, schema, atau query database.

## File yang Harus Diperiksa Sebelum Coding
1.  `src/types/index.ts` - Untuk melihat struktur tipe data yang direpresentasikan dalam frontend.
2.  `src/api/*.ts` - Untuk memverifikasi tabel mana yang digunakan aplikasi.

## Workflow Implementasi
1.  Verifikasi tabel yang ada. Saat ini tabel yang **TERVERIFIKASI ADA** hanyalah:
    *   `orders`: (id, customerName, whatsapp, email, notes, items, totalPrice, status, createdAt)
    *   `config`: (id, whatsapp, maps, instagram, email, phone, address, hours)
2.  Sesuaikan type di `src/types/index.ts` jika ada penambahan/perubahan schema yang disepakati.

## Aturan Khusus
*   Gunakan tipe `Order`, `OrderItem`, `ContactConfig` saat mapping hasil database.
*   Jika harus mengambil banyak relasi, ingat ini adalah Supabase/PostgreSQL (Gunakan sintaks `select()`).

## Hal yang Dilarang
*   **ANTI-HALU**: Jangan mengarang tabel (misal tabel `products`, `users`, `categories`). Data produk saat ini **TERVERIFIKASI** di-hardcode di dalam file `index.html`.
*   Jangan menambahkan kolom baru tanpa penjelasan dan konfirmasi persetujuan dari user, karena itu berarti mengubah struktur tabel asli di Supabase yang tidak ada di codebase.

## Cara Melakukan Verification
*   Lakukan testing input dan perhatikan Network tab (Request/Response dari Supabase).

## Definition of Done
*   Query berhasil dan data sesuai dengan struktur yang disepakati, tanpa menebak schema.
