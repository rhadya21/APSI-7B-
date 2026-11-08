# Gap report

- Figma tidak memiliki frame laporan penjualan pemilik pada node `1:5973`. Halaman pemilik yang ada di proyek menggunakan data transaksi database dan pola visual sidebar/panel yang sama, tetapi tabel/filter laporan adalah kebutuhan use case yang tidak memiliki referensi visual langsung.
- Figma tidak mendefinisikan field uang diterima dan kembalian secara eksplisit. Field database `uang_diterima` dan `kembalian` ditambahkan agar validasi pembayaran kasir lengkap.
- Figma MCP mengembalikan asset logo login sebagai PNG raster; font family tidak terdefinisi pada variable definitions. Implementasi mempertahankan fallback system/Geist yang sudah dipakai proyek dan perlu diganti bila nama font asli diberikan.
