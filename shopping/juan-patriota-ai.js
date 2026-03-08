// app/public/shopping/juan-patriota-ai.js

window.procesarMensajeIA = async function(text, container) {
    if (!container) return;
    
    // 1. Mostramos que Juan está pensando (estética)
    const typingMsg = document.createElement("div");
    typingMsg.className = "msg msg-bot chat-typing-temp";
    typingMsg.innerHTML = `<div class="bubble" style="font-style:italic; opacity:0.7;">Juan está escribiendo...</div>`;
    container.appendChild(typingMsg);
    container.scrollTop = container.scrollHeight;

    try {
        // 2. LA LLAMADA CLAVE: Usamos la IP exacta que tiró su terminal (127.0.0.1)
        const response = await fetch('http://127.0.0.1:5050/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });

        if (!response.ok) throw new Error("Error en la respuesta del server");

        const data = await response.json();
        const respuesta = data.reply || data.response || "No recibí respuesta clara del server, Jefe.";
        
        // Quitamos el "escribiendo"
        const temp = container.querySelector(".chat-typing-temp");
        if(temp) temp.remove();

        // 3. Mostramos la respuesta real de Juan
        const botMsg = document.createElement("div");
        botMsg.className = "msg msg-bot";
        botMsg.innerHTML = `<div class="bubble" style="background:#f1f5f9; color:#0b1220; padding:10px; border-radius:10px; margin-bottom:10px; border: 1px solid #e2e8f0;">${respuesta}</div>`;
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;

    } catch (e) {
        console.error("Error conectando al server:", e);
        const temp = container.querySelector(".chat-typing-temp");
        if(temp) temp.remove();
        
        const errorMsg = document.createElement("div");
        errorMsg.className = "msg msg-bot";
        errorMsg.innerHTML = `<div class="bubble" style="background:#fee2e2; color:991b1b; padding:10px; border-radius:10px;">¡Se me cortó el cable con el server (5050), Jefe! Verifique que la IP 127.0.0.1 sea la correcta.</div>`;
        container.appendChild(errorMsg);
    }
};
// AGREGAR AL FINAL DE TU juan-patriota-ai.js
async function hablarJuan(texto) {
    try {
        const response = await fetch(
            "https://api-inference.huggingface.co/models/coqui/XTTS-v2",
            {
                headers: { 
                    "Authorization": "Bearer TU_TOKEN_DE_HUGGING_FACE", // El que ya tenés guardado
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({ "inputs": texto }),
            }
        );
        const blob = await response.blob();
        const audio = new Audio(URL.createObjectURL(blob));
        audio.play();
    } catch (err) {
        console.error("Error en la voz de Juan:", err);
    }
}