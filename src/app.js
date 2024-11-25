// File: src/app.js

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk mengizinkan CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Fungsi untuk memuat database JSON
async function loadDatabase() {
    try {
        const databasePath = path.join(__dirname, '../data/database.json');
        const data = await fs.readFile(databasePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading database:', error);
        throw new Error('Database cannot be loaded');
    }
}

// Fungsi untuk menyimpan database JSON
async function saveDatabase(data) {
    try {
        const databasePath = path.join(__dirname, '../data/database.json');
        await fs.writeFile(databasePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving database:', error);
        throw new Error('Database cannot be saved');
    }
}

// Fungsi untuk mencocokkan pola dengan regex
function matchPattern(message, patterns) {
    return patterns.some(pattern => new RegExp(pattern, 'i').test(message));
}

// Fungsi untuk mendapatkan respons berdasarkan kata kunci
async function getResponse(message) {
    const database = await loadDatabase();

    for (const [key, value] of Object.entries(database)) {
        if (key !== "default" && matchPattern(message, value.patterns)) {
            const responses = value.responses;
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    return null;
}

// Fungsi untuk mendeteksi tipe input
function detectInputType(message) {
    if (/^(hai|halo|selamat|apa kabar)/i.test(message)) return "sapaan";
    if (/(terima kasih|thank you)/i.test(message)) return "ucapan terima kasih";
    if (/\?$/.test(message)) return "pertanyaan";
    if (/^(tambah|tambahkan|tuliskan|simpan)/i.test(message)) return "penambahan data";
    if (/^(koreksi|perbaiki)/i.test(message)) return "koreksi";
    if (/(\d+\s*[\+\-\*\/]\s*\d+)/.test(message)) return "hitungan";
    return "informasi";
}

// Fungsi untuk menghasilkan respons baru jika tidak ditemukan di database
async function generateNewResponse(message) {
    const database = await loadDatabase();
    const parts = [];

    for (const category of Object.values(database)) {
        if (category.responses) {
            category.responses.forEach(response => {
                const sentences = response.split(/[.,!?]/).map(sentence => sentence.trim()).filter(Boolean);
                parts.push(...sentences);
            });
        }
    }

    if (parts.length > 0) {
        const randomResponse = [];
        for (let i = 0; i < 3; i++) {
            randomResponse.push(parts[Math.floor(Math.random() * parts.length)]);
        }
        return randomResponse.join(". ") + ".";
    }

    return "Maaf, saya belum memiliki jawaban untuk pertanyaan tersebut.";
}

// Endpoint untuk menambahkan data baru ke database
app.post('/api/add-data', async (req, res) => {
    const { message, response } = req.body;

    if (!message || !response) {
        return res.status(400).json({ error: "Message and response are required." });
    }

    try {
        const database = await loadDatabase();

        database.custom = database.custom || { patterns: [], responses: [] };
        database.custom.patterns.push(message);
        database.custom.responses.push(response);

        await saveDatabase(database);
        res.json({ message: "Data berhasil ditambahkan." });
    } catch (error) {
        res.status(500).json({ error: "Failed to add data." });
    }
});

// Menyajikan file statis dari folder 'public'
app.use(express.static(path.join(__dirname, '../public')));

// Endpoint untuk menerima pesan dari frontend dan memberikan respons
app.post('/api/message', async (req, res) => {
    const message = req.body.message.toLowerCase();
    const type = detectInputType(message);
    let reply;

    try {
        reply = await getResponse(message);

        if (!reply) {
            reply = await generateNewResponse(message);
        }

        res.json({ reply, type });
    } catch (error) {
        res.status(500).json({ error: "Failed to process the message." });
    }
});

// Endpoint untuk menyimpan feedback dari pengguna
app.post('/api/feedback', async (req, res) => {
    const { message, reply, feedback } = req.body;

    if (!message || !reply || feedback === undefined) {
        return res.status(400).json({ error: "Message, reply, and feedback are required." });
    }

    const feedbackData = { message, reply, feedback };

    try {
        await fs.appendFile(path.join(__dirname, '../data/feedback.json'), JSON.stringify(feedbackData) + "\n");
        res.json({ message: "Feedback berhasil disimpan." });
    } catch (error) {
        res.status(500).json({ error: "Failed to save feedback." });
    }
});

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
