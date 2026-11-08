# Visual QA

- Referensi utama diambil dari screenshot Figma node `1:5973` dengan ukuran render 1024 × 456 dan frame target 1440 × 1024.
- Login menggunakan palet `#5869B5`, panel transparan, border putih, radius besar, dan asset PNG yang diekspor dari node `1:7020`.
- Kasir/payment dan bukti pembayaran mempertahankan ukuran desktop 1440 × 1024, sidebar 240 px, panel biru, serta kartu ringkasan putih.
- Verifikasi fungsional yang dijalankan: login form memakai server action, role guard cookie, pembayaran membuat `pembayaran` + `transaksi` dalam satu Prisma transaction, receipt memakai print stylesheet, dan laporan membaca transaksi selesai dari database.
- Screenshot browser pixel-diff belum dapat dijalankan dalam sesi ini karena tidak ada browser page yang dibagikan; validasi akhir dilakukan lewat `npm run lint` dan `npm run build`.
