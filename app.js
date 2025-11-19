const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const statusEl = document.getElementById("status");
const outputEl = document.getElementById("output");

if (!SpeechRecognition) {
  outputEl.textContent = "Browser Anda tidak mendukung Web Speech API.";
} else {
  const rec = new SpeechRecognition();
  rec.lang = "id-ID";
  rec.interimResults = false;
  rec.continuous = true;

  rec.onstart = () => {
    statusEl.textContent = "Status: mendengarkan...";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  rec.onend = () => {
    statusEl.textContent = "Status: idle";
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };

  // === EVENT RESULT ===
  rec.onresult = (event) => {
    const text = event.results[event.resultIndex][0].transcript;
    outputEl.textContent = text;

    // === KIRIM KE SERVER (GANTI URL SESUAI BACKEND KAMU) ===
    fetch("https://YOUR-SERVER-API.com/storeVoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transcript: text,
        time: new Date().toISOString()
      })
    })
    .then(res => console.log("Server response:", res.status))
    .catch(err => console.error("Upload failed:", err));
  };

  startBtn.onclick = () => {
    try { rec.start(); } catch (e) { console.error(e); }
  };

  stopBtn.onclick = () => rec.stop();
}
