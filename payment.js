document.addEventListener('DOMContentLoaded', function() {
    // ========================================================
    // <-- PERHATIKAN BAGIAN INI: MEMBACA DATA DARI URL -->
    // ========================================================
    // 1. Ambil parameter dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomType = urlParams.get('room');
    const roomPrice = urlParams.get('price');

    // 2. Tampilkan detail pemesanan di halaman
    if (roomType && roomPrice) {
        // `.replace(/%20/g, ' ')` mengubah kode spasi (%20) kembali menjadi spasi biasa
        document.getElementById('summary-room-type').textContent = roomType.replace(/%20/g, ' ');
        document.getElementById('summary-room-price').textContent = roomPrice;
        document.getElementById('summary-total').textContent = roomPrice;
    } else {
        // Tampilkan pesan jika data tidak ditemukan
        document.getElementById('summary-room-type').textContent = 'Data tidak ditemukan';
        document.getElementById('summary-room-price').textContent = '-';
        document.getElementById('summary-total').textContent = '-';
    }

    // Tangani submit form pembayaran
    const paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const paymentMethod = document.getElementById('payment-method').value;

        if (!name || !email || !phone || !paymentMethod) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        const notification = document.createElement('div');
        notification.textContent = `Pembayaran untuk ${roomType.replace(/%20/g, ' ')} atas nama ${name} berhasil!`;
        notification.style.position = 'fixed';
        notification.style.top = '50%';
        notification.style.left = '50%';
        notification.style.transform = 'translate(-50%, -50%)';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '20px 30px';
        notification.style.borderRadius = '8px';
        notification.style.zIndex = '1000';
        notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        notification.style.textAlign = 'center';
        document.body.appendChild(notification);
        
        paymentForm.reset();

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 3000);
    });
});