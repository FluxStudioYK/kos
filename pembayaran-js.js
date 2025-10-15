// Tunggu hingga seluruh konten HTML dimuat
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Ambil data booking dari localStorage
        const bookingData = JSON.parse(localStorage.getItem('bookingData') || '{}');
        
        // Update informasi kamar dan harga jika data tersedia
        if (bookingData && Object.keys(bookingData).length > 0) {
            // Update judul kamar jika elemen ada
            const roomTitle = document.querySelector('.room-title h1');
            if (roomTitle && bookingData.roomName) {
                roomTitle.textContent = bookingData.roomName;
            }
            
            // Update harga kamar jika elemen ada
            const priceValue = document.querySelector('.price-value');
            if (priceValue && bookingData.priceFormatted) {
                priceValue.textContent = bookingData.priceFormatted;
            }
            
            // Tambahkan informasi durasi menginap jika ada
            const pricePeriod = document.querySelector('.price-period');
            if (pricePeriod && bookingData.duration) {
                pricePeriod.textContent = `untuk ${bookingData.duration} hari`;
            }
        }
    } catch (error) {
        console.error('Error saat memperbarui informasi kamar:', error);
    }

        // Kode tombol simpan dinonaktifkan karena elemen tidak ada di halaman
    // Kode ini akan diaktifkan kembali jika tombol simpan ditambahkan ke halaman

    // Kode tombol bagikan dinonaktifkan karena elemen tidak ada di halaman
    // Kode ini akan diaktifkan kembali jika tombol bagikan ditambahkan ke halaman

});