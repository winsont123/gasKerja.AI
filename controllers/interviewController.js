const { AzureOpenAI } = require("openai");

const handleInterview = async (req, res) => {
    try {
        const userMessage = req.body.message;

        const openAIClient = new AzureOpenAI({
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            apiVersion: "2024-02-15-preview"
        });

        // Prompt super spesifik agar AI bertindak seperti Assessor Galak
        const systemPrompt = `Anda adalah Lead Equity Analyst yang sedang mewawancarai kandidat. 
        Kandidat sedang menjawab studi kasus tentang perbandingan saham properti PANI dan CTRA.
        
        Tugas Anda:
        1. Evaluasi jawaban kandidat secara singkat (apakah logikanya masuk akal atau ada yang terlewat).
        2. Berikan 1 pertanyaan lanjutan (follow-up question) yang sangat tajam dan teknis.
        3. Jawab dengan singkat, maksimal 2-3 kalimat saja agar kandidat tidak bosan membaca.
        4. Gunakan format HTML murni ringan (seperti <strong> atau <br>) untuk penekanan.`;

        const response = await openAIClient.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userMessage }
            ],
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME
        });

        res.json({
            success: true,
            reply: response.choices[0].message.content
        });

    } catch (error) {
        console.error("Interview API Error:", error);
        res.status(500).json({ success: false, message: "Koneksi ke AI Assessor terputus." });
    }
};
const evaluateInterview = async (req, res) => {
    try {
        const transcript = req.body.transcript;

        const openAIClient = new AzureOpenAI({
            endpoint: process.env.AZURE_OPENAI_ENDPOINT,
            apiKey: process.env.AZURE_OPENAI_API_KEY,
            deployment: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            apiVersion: "2024-02-15-preview"
        });

        const systemPrompt = `Anda adalah Lead Assessor. Baca transkrip wawancara ini dan berikan penilaian akhir.
        Keluarkan respons Anda WAJIB dalam format JSON murni seperti ini:
        {
            "score": 85,
            "hrd_feedback": "<li class='mb-2'><span class='text-success fw-bold'>Kelebihan:</span> [Analisis untuk HRD]</li><li class='mb-2'><span class='text-danger fw-bold'>Kelemahan:</span> [Analisis]</li>",
            "pelamar_feedback": "<li class='mb-2'><span class='text-danger fw-bold'>Area Perbaikan:</span> [Feedback umum cara menjawab]</li><li class='mb-2'><span class='text-primary fw-bold'>Rekomendasi Course:</span> [Sebutkan 2 course spesifik dari Coursera/Dicoding/Udemy]</li>"
        }`;

        const response = await openAIClient.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Transkrip Wawancara:\n${transcript}` }
            ],
            model: process.env.AZURE_OPENAI_DEPLOYMENT_NAME,
            response_format: { type: "json_object" } // Memaksa AI menjawab dengan JSON valid
        });

        const resultData = JSON.parse(response.choices[0].message.content);
        
        res.json({ success: true, data: resultData });

    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ success: false });
    }
};


module.exports = { handleInterview, evaluateInterview };
