// document.getElementById('analyzeBtn').addEventListener('click', async () => {
//     const cvText = document.getElementById('cvText').value;
//     const targetRole = document.getElementById('targetRole').value;
//     const analyzeBtn = document.getElementById('analyzeBtn');
//     const resultArea = document.getElementById('resultArea');
//     const analysisOutput = document.getElementById('analysisOutput');

//     if (!cvText || !targetRole) {
//         alert("Mohon isi teks CV dan posisi target Anda dulu ya!");
//         return;
//     }

//     // Beri feedback visual saat loading
//     analyzeBtn.disabled = true;
//     analyzeBtn.innerText = "Sedang Menganalisis... ⏳";
//     resultArea.style.display = "none";

//     try {
//         const response = await fetch('/api/analyze-cv', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ cvText, targetRole })
//         });

//         const data = await response.json();

//         if (data.success) {
//             analysisOutput.innerText = data.analysis;
//             resultArea.style.display = "block";
//             // Scroll otomatis ke hasil
//             resultArea.scrollIntoView({ behavior: 'smooth' });
//         } else {
//             alert("Gagal menganalisis: " + data.message);
//         }
//     } catch (error) {
//         console.error("Error:", error);
//         alert("Terjadi kesalahan teknis. Cek koneksi server Anda.");
//     } finally {
//         analyzeBtn.disabled = false;
//         analyzeBtn.innerText = "Gas Analisis Sekarang!";
//     }
// });

// Fungsi untuk berpindah layar (Support 3 Halaman)
function goToStep(stepNumber) {
    // 1. Ambil semua elemen step
    const step1 = document.getElementById('step-1');
    const step2 = document.getElementById('step-2');
    const step3 = document.getElementById('step-3');

    // 2. Sembunyikan semuanya dengan aman
    if (step1) step1.classList.add('d-none');
    if (step2) step2.classList.add('d-none');
    if (step3) step3.classList.add('d-none');

    // 3. Tampilkan hanya step yang diminta
    const targetStep = document.getElementById('step-' + stepNumber);
    if (targetStep) {
        targetStep.classList.remove('d-none');
        window.scrollTo(0, 0); // Pastikan layar kembali ke atas
    } else {
        console.error("Waduh, Elemen step-" + stepNumber + " tidak ditemukan di HTML!");
    }
}

// Fungsi dummy untuk memproses CV (akan hubungkan ke backend nanti)
async function processCV() {
    console.log("🚀 Halo! processCV berhasil dipanggil!");
    const input = document.getElementById('cvInput');
    const uploadText = document.getElementById('upload-text');
    const startBtn = document.getElementById('startBtn');
    const feedbackBox = document.getElementById('cv-feedback-box');
    const analysisContent = document.getElementById('analysis-content');
    const targetRole = document.getElementById('jobSelect').value;

    if (input.files.length > 0) {
        uploadText.innerText = "⏳ Menganalisis CV: " + input.files[0].name + "...";
        

        // agar cepat, asumsikan ekstraksi teks berhasil (atau gunakan simulasi teks).
        const dummyCvText = "Saya adalah lulusan Finance dengan kemampuan analisis laporan keuangan dan valuasi saham."; 

        try {
            const response = await fetch('/api/analyze-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    cvText: dummyCvText, 
                    targetRole: targetRole 
                })
            });

            const data = await response.json();

            if (data.success) {
                analysisContent.innerHTML = data.analysis; 
                
                feedbackBox.style.display = "block";
                uploadText.innerText = "✅ Analisis Skill Gap Selesai!";
                startBtn.disabled = false;
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Gagal menghubungi AI. Pastikan server sudah jalan!");
        }
    }
}

// ==========================================
// LOGIKA STEP 2: WAWANCARA VOICE & TEXT
// ==========================================

const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const chatBox = document.getElementById('chatBox');



// Logika menampilkan chat di layar
// Logika mengirim pesan ke AI Assessor
// Logika mengirim pesan ke AI Assessor
sendBtn.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    // 1. Tampilkan chat User
    chatBox.innerHTML += `
        <div class="mb-3 text-end">
            <span class="badge bg-secondary mb-1">Anda</span>
            <div class="bg-primary text-white p-3 rounded-3 shadow-sm d-inline-block text-start border" style="max-width: 85%;">
                ${message}
            </div>
        </div>
    `;
    
    chatInput.value = ""; // Kosongkan input
    chatBox.scrollTop = chatBox.scrollHeight;

    // Buat ID unik untuk indikator typing agar mudah dihapus nanti
    const typingId = "typing-" + Date.now();

    // 2. Tampilkan indikator "Sedang mengetik..."
    chatBox.innerHTML += `
        <div class="mb-3 text-start" id="${typingId}">
            <span class="badge bg-primary mb-1">AI Assessor</span>
            <div class="bg-white p-2 rounded-3 shadow-sm d-inline-block border text-muted">
                <i>Sedang menganalisis jawaban... ⏳</i>
            </div>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;

    // 3. Panggil API Backend
    try {
        const response = await fetch('/api/chat-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();
        
        // Hapus indikator typing
        document.getElementById(typingId).remove();

        // 4. Tampilkan balasan AI
        if (data.success) {
            chatBox.innerHTML += `
                <div class="mb-3 text-start">
                    <span class="badge bg-primary mb-1">AI Assessor</span>
                    <div class="bg-white p-3 rounded-3 shadow-sm d-inline-block border" style="max-width: 85%;">
                        ${data.reply}
                    </div>
                </div>
            `;
        } else {
            alert("Gagal memproses jawaban. Silakan coba lagi.");
        }
    } catch (error) {
        document.getElementById(typingId).remove();
        alert("Terjadi kesalahan teknis pada server.");
    }
    
    chatBox.scrollTop = chatBox.scrollHeight;
});



// Bisa tekan "Enter" di keyboard untuk kirim
chatInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

// ==========================================
// LOGIKA MICROPHONE (ANTI-GAGAL)
// ==========================================
const micBtn = document.getElementById('micBtn');

// Deteksi dukungan browser (Wajib Chrome / Edge)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    // Jika browser tidak mendukung
    micBtn.addEventListener('click', () => {
        alert("Browser ini tidak mendukung fitur suara. Tolong gunakan Google Chrome atau Microsoft Edge untuk demo ini ya!");
    });
} else {
    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID'; // Bahasa Indonesia
    recognition.interimResults = false;

    // Saat tombol diklik
    micBtn.addEventListener('click', () => {
        try {
            recognition.start();
            micBtn.classList.replace('btn-outline-danger', 'btn-danger');
            micBtn.innerHTML = "🔴 Mendengarkan...";
            console.log("Mic menyala, silakan bicara...");
        } catch (error) {
            console.error("Mic sudah merekam atau terjadi error:", error);
        }
    });

    // Saat suara berhasil ditangkap
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log("Berhasil merekam:", transcript);
        
        // Tambahkan spasi jika sudah ada teks sebelumnya
        chatInput.value = chatInput.value ? chatInput.value + " " + transcript : transcript; 
        resetMicButton();
    };

    // Jika terjadi error (misal: izin belum di-allow)
    recognition.onerror = (event) => {
        console.error("Error pada Mikrofon:", event.error);
        if (event.error === 'not-allowed') {
            alert("Akses mikrofon diblokir! Klik ikon gembok di kiri atas URL (address bar) dan izinkan (allow) mikrofon.");
        }
        resetMicButton();
    };

    // Reset tombol jika suara selesai
    recognition.onend = resetMicButton;

    function resetMicButton() {
        micBtn.classList.replace('btn-danger', 'btn-outline-danger');
        micBtn.innerHTML = "🎤 Bicara";
    }
}

// Fungsi untuk memunculkan Step 3 (Final Result)
async function finishInterview() {
    const btnAkhiri = document.querySelector('button[onclick="finishInterview()"]');
    btnAkhiri.innerHTML = "⏳ AI Sedang Mengkalkulasi Nilai & Feedback...";
    btnAkhiri.disabled = true;

    // Trik Cepat: Ambil semua teks dari dalam kotak chat
    const transcript = document.getElementById('chatBox').innerText;

    try {
        const response = await fetch('/api/evaluate-interview', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ transcript: transcript })
        });
        
        const result = await response.json();

        if (result.success) {
            // Masukkan data riil dari AI ke HTML
            document.getElementById('finalScore').innerText = result.data.score;
            
            // Masukkan ke Dashboard HRD (Hapus ID 'finalFeedbackList' yang lama dan ganti querySelector)
            document.querySelector('#view-hrd ul').innerHTML = result.data.hrd_feedback;
            
            // Masukkan ke Layar Pelamar
            document.getElementById('pelamarFeedbackList').innerHTML = result.data.pelamar_feedback;

            // Pindah ke Step 3
            goToStep(3);
            switchView('pelamar'); // Default ke tampilan pelamar dulu
        } else {
            alert("Gagal memproses evaluasi akhir.");
            btnAkhiri.innerHTML = "Selesaikan Wawancara";
            btnAkhiri.disabled = false;
        }
    } catch (error) {
        console.error(error);
        alert("Terjadi kesalahan teknis saat evaluasi.");
        btnAkhiri.innerHTML = "Selesaikan Wawancara";
        btnAkhiri.disabled = false;
    }
}

// Fungsi untuk memisahkan Tampilan Pelamar dan Dashboard HRD
function switchView(viewType) {
    const btnPelamar = document.getElementById('btnPelamar');
    const btnHrd = document.getElementById('btnHrd');
    const viewPelamar = document.getElementById('view-pelamar');
    const viewHrd = document.getElementById('view-hrd');

    if (viewType === 'pelamar') {
        // Aktifkan tombol Pelamar
        btnPelamar.classList.replace('btn-outline-primary', 'btn-primary');
        btnHrd.classList.replace('btn-primary', 'btn-outline-primary');
        
        // Tampilkan konten Pelamar
        viewPelamar.classList.remove('d-none');
        viewHrd.classList.add('d-none');
    } else {
        // Aktifkan tombol HRD
        btnHrd.classList.replace('btn-outline-primary', 'btn-primary');
        btnPelamar.classList.replace('btn-primary', 'btn-outline-primary');
        
        // Tampilkan konten HRD
        viewHrd.classList.remove('d-none');
        viewPelamar.classList.add('d-none');
    }
}
