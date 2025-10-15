document.addEventListener('DOMContentLoaded', function() {
    // Data kamar
    const roomData = {
        type1: { name: 'Kamar Type 1', price: 'Rp 750.000', priceValue: 750000, image: 'https://picsum.photos/seed/kamar1/400/300.jpg', type: 'type1' },
        type2: { name: 'Kamar Type 2', price: 'Rp 650.000', priceValue: 650000, image: 'https://picsum.photos/seed/kamar2/400/300.jpg', type: 'type2' }
    };
    
    // Panggil calculateBookingDetails saat halaman dimuat untuk menampilkan harga awal
     document.addEventListener('DOMContentLoaded', function() {
         if (document.getElementById('booking-month') && document.getElementById('room-selector')) {
             calculateBookingDetails();
         }
     });

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
    }

    // Event listener untuk perubahan dropdown
    document.getElementById('room-selector').addEventListener('change', function() {
        updateRoomDetails(this.value);
    });
    
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
    
    // Event listener untuk pemilihan kamar dan bulan
    const roomSelector = document.getElementById('room-selector');
    const bookingMonth = document.getElementById('booking-month');
    
    if (roomSelector && bookingMonth) {
        roomSelector.addEventListener('change', calculateBookingDetails);
        bookingMonth.addEventListener('change', calculateBookingDetails);
    }

    // Fungsi untuk menghitung total harga berdasarkan bulan
    function calculateBookingDetails() {
        const selectedRoomKey = document.getElementById('room-selector').value;
        const selectedMonths = parseInt(document.getElementById('booking-month').value);
        const room = roomData[selectedRoomKey];
        
        if (room && selectedMonths) {
            // Hitung harga berdasarkan bulan yang dipilih
            const priceValue = room.priceValue || parseInt(room.price.replace(/\D/g, ''));
            const totalPrice = priceValue * selectedMonths;
            
            // Format harga dengan pemisah ribuan
            const priceFormatted = `Rp ${totalPrice.toLocaleString('id-ID')}`;
            
            // Update tampilan total harga
            document.getElementById('total-price').textContent = priceFormatted;
            
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
            
            console.log(`Total harga dihitung: ${priceFormatted} untuk ${selectedMonths} bulan`);
        }
    }
    
    // Panggil fungsi perhitungan saat halaman dimuat
    document.addEventListener('DOMContentLoaded', function() {
        // Inisialisasi dengan nilai default jika input sudah ada
        const checkInInput = document.getElementById('check-in-date');
        const checkOutInput = document.getElementById('check-out-date');
        
        if (checkInInput.value && checkOutInput.value) {
            calculateBookingDetails();
        }
    });
    
    // Event listener untuk perubahan tanggal dan tipe kamar
    document.getElementById('check-in-date').addEventListener('change', calculateBookingDetails);
    document.getElementById('check-out-date').addEventListener('change', calculateBookingDetails);
    document.getElementById('room-selector').addEventListener('change', calculateBookingDetails);
    
    // Set tanggal minimum untuk check-in (hari ini)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in-date').min = today;
    
    // Update tanggal minimum check-out saat check-in berubah
    document.getElementById('check-in-date').addEventListener('change', function() {
        const checkInDate = this.value;
        if (checkInDate) {
            // Set tanggal minimum check-out = check-in + 1 hari
            const nextDay = new Date(checkInDate);
            nextDay.setDate(nextDay.getDate() + 1);
            const nextDayStr = nextDay.toISOString().split('T')[0];
            document.getElementById('check-out-date').min = nextDayStr;
        }
    });

    // Fungsi untuk tombol PESAN SEKARANG
    document.getElementById('btn-book-now').addEventListener('click', function() {
        const selectedRoomKey = document.getElementById('room-selector').value;
        const selectedMonths = parseInt(document.getElementById('booking-month').value);
        const room = roomData[selectedRoomKey];
        
        if (!selectedMonths || !room) {
            showNotification('Silakan pilih tipe kamar dan durasi sewa');
            return;
        }
        
        // Recalculate booking details to ensure data is fresh
        calculateBookingDetails();
        
        // Ambil data booking dari localStorage
        const bookingData = JSON.parse(localStorage.getItem('bookingData'));
        
        if (!bookingData) {
            showNotification('Terjadi kesalahan. Silakan coba lagi.');
            return;
        }
        
        console.log("Mengarahkan ke halaman pembayaran dengan data:", bookingData);
        
        // Arahkan ke halaman pembayaran dengan parameter
        window.location.href = 'pembayaran.html';
    });

    // ... (kode untuk tombol Tulis Ulasan tetap sama) ...
    // Anda bisa menyalin kembali bagian 'Tulis Ulasan' dari kode sebelumnya jika belum ada
});