# 🚀 gasKerja.AI — Talent Intelligence System

gasKerja.AI adalah purwarupa platform rekrutmen berbasis AI yang mengevaluasi kandidat secara **holistik dan berbasis penalaran (reasoning-based assessment)**.

Berbeda dengan ATS tradisional yang hanya memindai keyword, gasKerja.AI bertindak sebagai **AI Assessor** yang mampu:
- Mengidentifikasi skill gap
- Melakukan wawancara teknis interaktif
- Memberikan evaluasi kandidat yang actionable

---

## 🧠 Why This Matters

Sistem rekrutmen konvensional:
❌ Hanya membaca keyword
❌ Tidak memahami logika kandidat
❌ Minim feedback

gasKerja.AI:
✅ Context-aware evaluation
✅ Real-time reasoning
✅ Insightful feedback

---

## ✨ Fitur Utama

### 📄 1. AI Document Intelligence (Pre-Screening)
- Ekstraksi CV dari PDF
- Analisis skill gap
- Deteksi kekurangan administratif

### 🎙️ 2. Live Technical Interview (Voice & Text)
- Input suara via Web Speech API
- Studi kasus nyata: Valuasi & struktur modal PANI vs CTRA
- AI melakukan: Follow-up question, Analisis jawaban, Evaluasi logika

### 📊 3. Dual-View Final Evaluation

**👤 Candidate View**
- Status kelulusan
- Feedback umum
- Rekomendasi belajar

**🧑‍💼 HR Dashboard (Confidential)**
- Skor AI
- Evaluasi teknikal
- Insight tersembunyi

---

## 🏗️ Tech Stack

**Frontend:** HTML5, CSS3 (Bootstrap 5), Vanilla JavaScript, Web Speech API
**Backend:** Node.js, Express.js
**AI Engine:** Azure OpenAI
**Document Processing:** PDF.js / Azure Document Intelligence

---

## ⚙️ Cara Menjalankan (Local Setup)

### 1. Prasyarat
- Node.js (v18+)
- Git

### 2. Install
Jalankan perintah berikut di terminal Anda:

git clone https://github.com/winsont123/gasKerja.AI.git
cd gasKerja.AI
npm install

### 3. Setup Environment
Buat file bernama .env di root directory proyek, lalu isi dengan format berikut:

PORT=3000
AZURE_OPENAI_ENDPOINT=https://YOUR_RESOURCE_NAME.openai.azure.com/
AZURE_OPENAI_API_KEY=your_openai_api_key_here
AZURE_OPENAI_DEPLOYMENT_NAME=your_model_deployment
AZURE_DOCUMENT_ENDPOINT=https://YOUR_DOCUMENT_RESOURCE.cognitiveservices.azure.com/
AZURE_DOCUMENT_KEY=your_document_api_key_here

### 4. Jalankan Server
Ketik perintah ini di terminal:

npm start

Buka browser dan akses: http://localhost:3000
(Disarankan menggunakan Chrome / Edge untuk fitur microphone)

---

## 🧪 Testing Flow

-Step 1 — CV Analysis: Upload CV -> Pilih role -> Tunggu analisis AI
-Step 2 — Interview: Klik "Mulai Interview" -> Jawab via Voice/Text -> Interaksi dengan AI
-Step 3 — Finish: Klik "Selesaikan Wawancara"
-Step 4 — Evaluation: Gunakan toggle untuk melihat Candidate View atau HR Dashboard

---

## 🚧 Limitasi Saat Ini

- Single role (Equity Analyst)
- Belum ada database persistence
- Parsing CV sebagian masih simulasi

---

## 🔮 Future Development

- Multi-role support
- Dynamic AI-generated case study
- Candidate benchmarking
- LMS integration
- HR analytics dashboard

---

## 🏁 Closing

> Hiring bukan tentang keyword. Tapi tentang cara seseorang berpikir.

gasKerja.AI membawa pendekatan baru: **rekrutmen berbasis kemampuan nyata, bukan sekadar CV.**

Developed For Hackathon / AI Competition Prototype
