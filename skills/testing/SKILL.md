---
name: testing
description: Running and creating automated tests for the application.
---

# Testing Skill

## Kapan Skill Digunakan
Gunakan skill ini saat diminta membuat atau menjalankan testing.

## File yang Harus Diperiksa Sebelum Coding
1.  `package.json` - Untuk memeriksa script testing dan dependency testing (seperti vitest, jest, cypress, playwright).

## Workflow Implementasi
*   **UNKNOWN**: Saat ini aplikasi TIDAK memiliki setup testing (tidak ada jest/vitest di `package.json`).
*   Jika diminta melakukan testing, konfirmasi dahulu kepada user apakah ingin menginstal framework testing tertentu.

## Aturan Khusus
*   Jika framework testing telah diinstal, ikuti best practice dari framework tersebut.

## Hal yang Dilarang
*   Jangan mengarang perintah `npm run test` jika script tidak ada di `package.json`.
*   Jangan mengarang letak direktori test jika belum dibuat (misal `__tests__` atau file `.spec.ts`).

## Cara Melakukan Verification
*   Jalankan framework testing dan pastikan status PASS.

## Definition of Done
*   Test pass.
*   Coverage tidak berkurang.
