/* Contenedor principal de Juan */
#juanMaster {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999; /* Por encima de todo */
    font-family: sans-serif;
}

/* El botón flotante (Juan saludando) */
.juan-float {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: transform 0.3s ease;
}

.juan-float:hover {
    transform: scale(1.05);
}

.juan-img {
    height: 180px; /* Tamaño más moderado */
    width: auto;
    filter: drop-shadow(0 10px 15px rgba(0,0,0,0.3));
}

.juan-dialog {
    background: white;
    color: #020617;
    padding: 8px 15px;
    border-radius: 15px;
    border: 2px solid #d4a017;
    font-weight: bold;
    font-size: 14px;
    margin-bottom: -10px;
    position: relative;
    z-index: 2;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

/* Panel de Chat */
.chat-panel {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    background: #020617;
    border-radius: 20px;
    border: 1px solid #334155;
    display: none; /* Se activa con JS */
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.chat-panel.active {
    display: flex;
}

.chat-header {
    background: #0ea5e9;
    padding: 15px;
    color: white;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    background: #0f172a;
}

.bubble {
    padding: 10px 14px;
    border-radius: 15px;
    max-width: 85%;
    font-size: 14px;
    line-height: 1.4;
}

.msg-bot .bubble { background: #1e293b; color: white; border-bottom-left-radius: 2px; }
.msg-user { align-self: flex-end; }
.msg-user .bubble { background: #0ea5e9; color: white; border-bottom-right-radius: 2px; }

/* Input y Footer */
.chat-input-row {
    display: flex;
    padding: 15px;
    background: #020617;
    gap: 8px;
}

.chat-input-row input {
    flex: 1;
    background: #1e293b;
    border: 1px solid #334155;
    color: white;
    padding: 10px;
    border-radius: 10px;
    outline: none;
}

.chat-footer {
    padding: 10px;
    border-top: 1px solid #334155;
}