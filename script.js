document.addEventListener('DOMContentLoaded', function() {
    // Data kamar
    const roomData = {
        type1: { name: 'Kamar Type 1', price: 'Rp 750.000', priceValue: 750000, image: 'https://picsum.photos/seed/kamar1/400/300.jpg', type: 'type1' },
        type2: { name: 'Kamar Type 2', price: 'Rp 650.000', priceValue: 650000, image: 'https://picsum.photos/seed/kamar2/400/300.jpg', type: 'type2' }
    };

    // Fungsi untuk memperbarui detail kamar
    function updateRoomDetails(roomType) {
        const room = roomData[roomType];
        document.getElementById('room-type').textContent = room.name;
        document.getElementById('room-price').textContent = room.price;

        // Update gambar utama
        const heroSection = document.getElementById('hero');
        heroSection.style.backgroundImage = `url(${room.image})`;

        // Simpan data kamar yang dipilih ke localStorage
        localStorage.setItem('selectedRoom', JSON.stringify({
            type: roomType,
            name: room.name,
            price: room.price
        }));

        // Hitung ulang total harga setelah update kamar
        calculateBookingDetails();
    }

    // Cek apakah ada parameter room di URL
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get('room');

    if (roomParam && roomData[roomParam]) {
        // Jika ada parameter room yang valid, gunakan itu
        document.getElementById('room-selector').value = roomParam;
        updateRoomDetails(roomParam);
    } else {
        // Jika tidak ada, gunakan kamar default
        updateRoomDetails('type1');
    }

    // Event listener untuk perubahan dropdown kamar
    document.getElementById('room-selector').addEventListener('change', function() {
        console.log('Kamar berubah ke:', this.value);
        updateRoomDetails(this.value);
    });

    // Event listener untuk perubahan bulan sewa
    const bookingMonthSelect = document.getElementById('booking-month');
    if (bookingMonthSelect) {
        bookingMonthSelect.addEventListener('change', function() {
            console.log('Bulan berubah ke:', this.value);
            calculateBookingDetails();
        });
    }

    // Panggil calculateBookingDetails saat pertama kali halaman dimuat
    setTimeout(() => {
        calculateBookingDetails();
    }, 100);
    
    // Cek apakah kamar ini sudah disimpan sebelumnya
    const savedRooms = JSON.parse(localStorage.getItem('savedRooms')) || [];
    const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
    
    if (selectedRoom && savedRooms.some(room => room.type === selectedRoom.type)) {
        // Jika kamar sudah disimpan, update tampilan tombol simpan
        const saveButton = document.querySelector('.btn-save');
        const icon = saveButton.querySelector('i');
        icon.classList.remove('far');
        icon.classList.add('fas');
        saveButton.style.backgroundColor = '#FFD448';
        saveButton.style.color = '#303030';
    }

    // Fungsi untuk tombol Simpan
    document.querySelector('.btn-save').addEventListener('click', function() {
        const icon = this.querySelector('i');
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
        
        // Dapatkan daftar kamar yang disimpan atau buat array kosong jika belum ada
        let savedRooms = JSON.parse(localStorage.getItem('savedRooms')) || [];
        
        if (icon.classList.contains('far')) {
            // Simpan kamar
            icon.classList.remove('far');
            icon.classList.add('fas');
            this.style.backgroundColor = '#FFD448';
            this.style.color = '#303030';
            
            // Tambahkan kamar ke daftar yang disimpan jika belum ada
            if (selectedRoom && !savedRooms.some(room => room.type === selectedRoom.type)) {
                savedRooms.push(selectedRoom);
                localStorage.setItem('savedRooms', JSON.stringify(savedRooms));
                
                // Tampilkan notifikasi
                showNotification('Kamar berhasil disimpan!');
            }
        } else {
            // Batalkan simpan
            icon.classList.remove('fas');
            icon.classList.add('far');
            this.style.backgroundColor = 'transparent';
            this.style.color = '#ffffff';
            
            // Hapus kamar dari daftar yang disimpan
            if (selectedRoom) {
                savedRooms = savedRooms.filter(room => room.type !== selectedRoom.type);
                localStorage.setItem('savedRooms', JSON.stringify(savedRooms));
                
                // Tampilkan notifikasi
                showNotification('Kamar dihapus dari daftar simpan');
            }
        }
    });

    // Fungsi untuk tombol Bagikan
    document.querySelector('.btn-share').addEventListener('click', function() {
        const selectedRoom = JSON.parse(localStorage.getItem('selectedRoom'));
        const shareTitle = 'Kost BaLy - ' + document.getElementById('room-type').textContent;
        const shareText = `Lihat kamar ${selectedRoom ? selectedRoom.name : ''} di Kost BaLy dengan harga ${selectedRoom ? selectedRoom.price : ''} per bulan`;
        const shareUrl = window.location.href + (selectedRoom ? `?room=${selectedRoom.type}` : '');
        
        if (navigator.share) {
            navigator.share({
                title: shareTitle,
                text: shareText,
                url: shareUrl
            }).then(() => {
                showNotification('Berhasil membagikan!');
            }).catch(err => {
                console.error('Error sharing:', err);
                copyToClipboard(shareUrl);
            });
        } else {
            copyToClipboard(shareUrl);
        }
    });
    
    // Fungsi helper untuk menampilkan notifikasi
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#FFD448';
        notification.style.color = '#303030';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    // Fungsi helper untuk menyalin ke clipboard
    function copyToClipboard(text) {
        const dummy = document.createElement('input');
        document.body.appendChild(dummy);
        dummy.value = text;
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
        
        showNotification('Link telah disalin ke clipboard!');
    }

    // Fungsi untuk tombol PESAN SEKARANG (header)
    const btnBook = document.querySelector('.btn-book');
    if (btnBook) {
        btnBook.addEventListener('click', function() {
            document.querySelector('.booking-controls').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    }
    

    // Fungsi untuk menghitung total harga berdasarkan bulan
    function calculateBookingDetails() {
        const roomSelector = document.getElementById('room-selector');
        const bookingMonth = document.getElementById('booking-month');

        if (!roomSelector || !bookingMonth) {
            console.warn('Elemen selector tidak ditemukan');
            return;
        }

        const selectedRoomKey = roomSelector.value;
        const selectedMonths = parseInt(bookingMonth.value);
        const room = roomData[selectedRoomKey];

        if (room && selectedMonths) {
            // Hitung harga berdasarkan bulan yang dipilih
            const priceValue = room.priceValue || parseInt(room.price.replace(/\D/g, ''));
            const totalPrice = priceValue * selectedMonths;

            // Format harga dengan pemisah ribuan
            const priceFormatted = `Rp ${totalPrice.toLocaleString('id-ID')}`;

            // Update tampilan total harga dengan animasi
            const totalPriceElement = document.getElementById('total-price');
            if (totalPriceElement) {
                totalPriceElement.style.transition = 'all 0.3s ease';
                totalPriceElement.style.transform = 'scale(1.1)';
                totalPriceElement.textContent = priceFormatted;
                setTimeout(() => {
                    totalPriceElement.style.transform = 'scale(1)';
                }, 300);
            }

            // Perbarui tampilan total harga di elemen lain jika ada
            const totalPriceElements = document.querySelectorAll('.total-price');
            totalPriceElements.forEach(element => {
                element.textContent = priceFormatted;
            });

            // Update tampilan tipe kamar jika ada
            const roomTypeElement = document.getElementById('room-type');
            if (roomTypeElement) {
                roomTypeElement.textContent = room.name;
            }

            // Update tampilan harga kamar jika ada
            const roomPriceElement = document.getElementById('room-price');
            if (roomPriceElement) {
                roomPriceElement.textContent = room.price;
            }

            // Buat data booking
            const bookingData = {
                roomType: selectedRoomKey,
                roomName: room.name,
                roomPrice: room.price,
                priceValue: priceValue,
                durationMonths: selectedMonths,
                totalPrice: totalPrice,
                priceFormatted: priceFormatted
            };

            // Simpan data booking ke localStorage
            localStorage.setItem('bookingData', JSON.stringify(bookingData));

            console.log(`✓ Total harga: ${priceFormatted} untuk ${selectedMonths} bulan (${room.name})`);
        } else {
            console.warn('Data tidak lengkap:', { room, selectedMonths });
        }
    }
    

    // Fungsi untuk tombol PESAN SEKARANG
    const btnBookNow = document.getElementById('btn-book-now');
    if (btnBookNow) {
        btnBookNow.addEventListener('click', function(e) {
            e.preventDefault();

            const selectedRoomKey = document.getElementById('room-selector').value;
            const selectedMonths = parseInt(document.getElementById('booking-month').value);
            const room = roomData[selectedRoomKey];

            console.log('Tombol PESAN SEKARANG diklik');
            console.log('Data:', { selectedRoomKey, selectedMonths, room });

            if (!selectedMonths || !room) {
                showNotification('Silakan pilih tipe kamar dan durasi sewa');
                return;
            }

            // Hitung ulang detail booking untuk memastikan data fresh
            calculateBookingDetails();

            // Ambil data booking dari localStorage
            const bookingData = JSON.parse(localStorage.getItem('bookingData'));

            if (!bookingData) {
                showNotification('Terjadi kesalahan. Silakan coba lagi.');
                return;
            }

            console.log("✓ Mengarahkan ke halaman pembayaran dengan data:", bookingData);

            // Tambahkan delay kecil untuk memastikan data tersimpan
            setTimeout(() => {
                window.location.href = 'pembayaran.html';
            }, 100);
        });
    } else {
        console.error('Tombol btn-book-now tidak ditemukan!');
    }

    // ... (kode untuk tombol Tulis Ulasan tetap sama) ...
    // Anda bisa menyalin kembali bagian 'Tulis Ulasan' dari kode sebelumnya jika belum ada
});