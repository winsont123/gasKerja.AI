const { DocumentAnalysisClient, AzureKeyCredential } = require("@azure/ai-form-recognizer");
const { AzureOpenAI } = require("openai"); // Menggunakan library standar yang baru

// Inisialisasi Azure Document Intelligence
const docClient = new DocumentAnalysisClient(
    process.env.AZURE_DOCUMENT_ENDPOINT, 
    new AzureKeyCredential(process.env.AZURE_DOCUMENT_KEY)
);

const analyzeCV = async (req, res) => {
    try {
        let finalCvText = req.body.cvText;
        const targetRole = req.body.targetRole;

        // 1. JIKA ADA FILE: Gunakan Azure Document Intelligence
        if (req.file) {
            console.log("Memproses dokumen dengan Azure Document Intelligence...");
            const poller = await docClient.beginAnalyzeDocument("prebuilt-read", req.file.buffer);
            const { content } = await poller.pollUntilDone();
            finalCvText = content; 
        }

        if (!finalCvText || !targetRole) {
            return res.status(400).json({ success: false, message: "Data teks atau posisi tidak lengkap!" });
        }

        console.log("Menganalisis Skill Gap dengan Azure OpenAI...");

        // 2. KIRIM KE AZURE OPENAI (Versi SDK Terbaru)
        const openAIClient = new AzureOpenAI({
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            apiVersion: "2024-02-15-preview" // Wajib diisi pada versi terbaru
        });

        const systemPrompt = `Anda adalah HRD Expert Senior. Analisis CV kandidat untuk posisi ${targetRole}.
        
        ATURAN OUTPUT WAJIB:
        1. Jawab dengan SANGAT RINGKAS dan langsung ke inti (maksimal 3 poin Skill Gap).
        2. Berikan 3 Rekomendasi Course/Sertifikasi spesifik yang relevan (misal: Coursera, Dicoding, atau CFA).
        3. OUTPUT WAJIB BERUPA HTML MURNI (gunakan tag <h4>, <ul>, <li>, <strong>, <span class="text-danger">).
        4. JANGAN gunakan format markdown seperti ** atau #. JANGAN gunakan block backticks (\`\`\`).

        Contoh Format yang Diharapkan:
        <h4>🚨 Skill Gap Utama:</h4>
        <ul>
            <li><strong>Financial Modeling:</strong> Belum ada pengalaman DCF.</li>
        </ul>
        <h4 class="mt-3">📚 Rekomendasi Course:</h4>
        <ul>
            <li><strong>Coursera:</strong> Financial Engineering and Risk Management.</li>
        </ul>`;

        const response = await openAIClient.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Teks CV:\n${finalCvText}` }
            ],
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME // Model dialiaskan ke deployment name
        });

        res.json({
            success: true,
            analysis: response.choices[0].message.content,
            source: req.file ? "Azure Document Intelligence" : "Frontend PDF.js"
        });

    } catch (error) {
        console.error("Error Detail Server:", error);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan saat memproses data di server." 
        });
    }
};

module.exports = { analyzeCV };