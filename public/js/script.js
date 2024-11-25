// File: public/js/script.js

// Fungsi untuk menambahkan pesan ke kotak chat
function addChatMessage(sender, message) {
    const chatBox = document.getElementById("chat-box");
    const messageElement = document.createElement("p");
    messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi analisis sentimen yang lebih baik
function analyzeSentiment(text) {
    const positiveWords = ["baik", "senang", "terima kasih", "bagus", "hebat", "menyenangkan"];
    const negativeWords = ["buruk", "tidak", "sedih", "maaf", "kecewa", "jelek"];
    
    let sentimentScore = 0;
    const words = text.toLowerCase().split(/\s+/); // Memecah teks berdasarkan whitespace

    words.forEach(word => {
        if (positiveWords.includes(word)) sentimentScore++;
        if (negativeWords.includes(word)) sentimentScore--;
    });

    if (sentimentScore > 1) return "positif"; // Kriteria lebih ketat untuk sentimen positif
    if (sentimentScore < -1) return "negatif"; // Kriteria lebih ketat untuk sentimen negatif
    return "netral";
}

// Fungsi klasifikasi intent yang diperluas
function classifyIntent(text) {
    const lowerText = text.toLowerCase();
    if (/^(hai|halo|selamat|apa kabar|greetings)/i.test(lowerText)) return "sapaan";
    if (/terima kasih|thank you/i.test(lowerText)) return "ucapan terima kasih";
    if (/\?$/.test(lowerText)) return "pertanyaan";
    if (/^(tambah|tambahkan|tuliskan|simpan)/i.test(lowerText)) return "penambahan data";
    if (/^(koreksi|perbaiki)/i.test(lowerText)) return "koreksi";
    if (/minta|bantu|tolong/i.test(lowerText)) return "permintaan bantuan"; // Intent baru
    if (/buruk|jelek|sedih/i.test(lowerText)) return "komentar negatif"; // Intent untuk komentar negatif
    return "lainnya";
}

// Mengirim pesan ke backend
async function sendMessage() {
    const input = document.getElementById("user-input").value.trim();
    if (input === '') return;

    // Tampilkan pesan pengguna di kotak chat
    addChatMessage("User", input);

    // Analisis pesan pengguna
    const sentiment = analyzeSentiment(input);
    const intent = classifyIntent(input);
    
    console.log("Sentimen:", sentiment);
    console.log("Intent:", intent);

    // Kirim pesan ke backend dan tangani error
    try {
        const response = await fetch('/api/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: input, sentiment: sentiment, intent: intent })
        });
        
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        
        const data = await response.json();

        // Tampilkan respons dari Saipul
        if (data.reply) {
            addChatMessage("Saipul", data.reply);
        } else {
            // Jika tidak ada respons yang ditemukan, minta server untuk membuat jawaban baru
            addChatMessage("Saipul", "Saya tidak menemukan jawaban untuk pertanyaan Anda. Meminta bantuan lebih lanjut...");
            const newResponse = await fetch('/api/generate-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: input })
            });

            if (newResponse.ok) {
                const newData = await newResponse.json();
                addChatMessage("Saipul", newData.reply || "Maaf, saat ini saya tidak dapat memberikan jawaban.");
            } else {
                addChatMessage("Saipul", "Maaf, saya tidak dapat menghubungi server untuk mendapatkan jawaban baru.");
            }
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        addChatMessage("Saipul", "Maaf, terjadi kesalahan. Silakan coba lagi nanti.");
    }

    // Kosongkan input
    document.getElementById("user-input").value = '';
}

// Mengaktifkan atau menonaktifkan mode gelap
function toggleDarkMode() {
    const body = document.body;
    const modeToggle = document.getElementById("mode-toggle");

    body.classList.toggle("dark-mode");

    // Simpan status mode di localStorage
    if (body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        modeToggle.textContent = "☀️ Mode Terang";
    } else {
        localStorage.setItem("theme", "light");
        modeToggle.textContent = "🌙 Mode Gelap";
    }
}

// Cek dan terapkan tema saat halaman dimuat
function applyTheme() {
    const theme = localStorage.getItem("theme");
    const body = document.body;
    const modeToggle = document.getElementById("mode-toggle");

    if (theme === "dark") {
        body.classList.add("dark-mode");
        modeToggle.textContent = "☀️ Mode Terang";
    } else {
        body.classList.remove("dark-mode");
        modeToggle.textContent = "🌙 Mode Gelap";
    }
}

// Menunggu DOM selesai dimuat sebelum menerapkan tema dan mengatur event listener
document.addEventListener("DOMContentLoaded", () => {
    applyTheme();
    document.getElementById("mode-toggle").addEventListener("click", toggleDarkMode);
    document.getElementById("send-button").addEventListener("click", sendMessage);
    document.getElementById("user-input").addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
