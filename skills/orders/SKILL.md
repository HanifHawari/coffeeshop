---
name: orders
description: Modifying the ordering, cart, checkout, and payment flow.
---

# Orders Skill

## Kapan Skill Digunakan
Gunakan skill ini saat diminta memodifikasi cara pesanan ditambahkan ke keranjang, proses checkout form, kalkulasi harga, atau alur konfirmasi pembayaran (WhatsApp).

## File yang Harus Diperiksa Sebelum Coding
1.  `src/store/cartStore.ts` - Logic array keranjang lokal.
2.  `src/components/CartUI.ts` - Render keranjang, form order, dan redirect WhatsApp.
3.  `src/components/MenuUI.ts` - Logic tombol "Tambah ke Cart".
4.  `src/api/orderApi.ts` - Logic POST data ke database `orders`.

## Workflow Implementasi
1.  Pahami alur aslinya:
    *   Klik `btn-add-to-cart` -> state `cart` berubah.
    *   `renderCartUI` di `CartUI.ts` dipanggil -> UI keranjang diupdate.
    *   Form order dikirim -> POST via `orderApi.ts` ke Supabase.
    *   Sukses -> Tampilkan Modal Pembayaran -> User klik tombol WhatsApp.
2.  Jika mengubah logic harga, ubah di perhitungannya (contoh: cart reduce function).

## Aturan Khusus
*   Tipe data harga/price direpresentasikan sebagai `number` (dalam Rupiah).

## Hal yang Dilarang
*   **ANTI-HALU**: Jangan mengarang integrasi Payment Gateway otomatis (seperti Midtrans, Xendit, Stripe) kecuali secara spesifik diinstruksikan dan keys telah di-setup. Aplikasi saat ini menggunakan alur manual via WhatsApp.
*   Jangan menyimpan nomor kartu kredit di dalam project ini.

## Cara Melakukan Verification
*   Tambahkan barang ke keranjang dari UI.
*   Lakukan proses Checkout dummy.
*   Pastikan order muncul di Dashboard Admin, dan Link WhatsApp terbuat dengan teks dan total yang benar.

## Definition of Done
*   Alur pemesanan berjalan lancar dari awal hingga akhir.
*   Perhitungan harga total akurat.
