import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicPath = path.join(__dirname, "public");
if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/audios", cors(), express.static(publicPath));

// --- 📦 CATÁLOGO DE ELITE (ACTUALIZADO) ---
const CATALOGO = [
    { id: "pack-emprendedor", nombre: "Pack Emprendedor", precio: "Consultar" },
    { id: "pack-comercio", nombre: "Pack Comercio", precio: "Consultar" },
    { id: "fernet-750", nombre: "Pack 6 Fernet Branca 750ml", precio: 120, moneda: "USD" },
    { id: "yerba-1kg", nombre: "Yerba Mate Orgánica 1kg", precio: 15, moneda: "USD" },
    { id: "alfajores-12", nombre: "Caja 12 Alfajores Premium", precio: 45, moneda: "USD" },
    { id: "dulce-leche", nombre: "Dulce de Leche Colonial / Repostero", precio: "Ver en Tienda", desc: "¡SÍ TENEMOS! Es el mejor del mundo." }
];

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

let chatSession = model.startChat({
    history: [
        {
            role: "user",
            parts: [{ text: "Hola" }],
        },
        {
            role: "model",
            parts: [{ text: `IDENTIDAD: Sos Juan Patriota, el primer hijo y RRPP de Argenville (Argenvil).
            CONOCIMIENTO ABSOLUTO: ¡SÍ TENEMOS DULCE DE LECHE! Está en la sección Almacén de la tienda. Jamás digas que no hay.
            CATALOGO: ${JSON.stringify(CATALOGO)}.
            PROTOCOLO:
            1. LOGIN: Si 'isLoggedIn' es FALSE, pedí loguearse arriba.
            2. UBICACIÓN: Si está logueado, preguntá Ciudad y País.
            3. VENTA: Ofrecé productos y packs. Si algo no está en esta lista corta, decí que lo busquen en argenville.shopp porque tenemos de TODO.
            PERSONALIDAD: Tenor carismático, brillante, ejecutivo y breve. 
            ORATORIA: Usá "Mirá...", "Viste,", "Eh...". Máximo 2 oraciones.` }],
        },
    ],
});

app.post("/chat", async (req, res) => {
    try {
        const { message, userName, isLoggedIn } = req.body;
        const instruction = `[User: ${userName} | Logged: ${isLoggedIn}]. Protocolo Activo. Mensaje: ${message}`;

        const result = await chatSession.sendMessage(instruction);
        let replyText = result.response.text();

        // 🛡️ ESCUDO ANTI-EMOJIS
        const cleanText = replyText.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');

        const textForAudio = cleanText
            .replace(/Argenville/gi, 'Argenvil')
            .replace(/,/g, ',,') 
            .replace(/\./g, '. ') 
            .replace(/[*#]/g, '')
            .replace(/\n/g, ' ');

        const audioFileName = `juan_${Date.now()}.mp3`;
        const audioPath = path.join(publicPath, audioFileName);

        // 🎙️ CALIBRACIÓN TENOR: +12Hz | Rate -1%
        const ttsCommand = `edge-tts --voice es-AR-TomasNeural --rate=-1% --pitch=+12Hz --text "${textForAudio}" --write-media "${audioPath}"`;

        exec(ttsCommand, (error) => {
            if (error) return res.json({ reply: replyText, audioUrl: null });
            res.json({ reply: replyText, audioUrl: `http://localhost:5050/audios/${audioFileName}` });
        });
    } catch (err) {
        console.error("🔥 Error:", err.message);
        res.status(500).json({ error: "Falla" });
    }
});

app.listen(5050, "0.0.0.0", () => {
    console.log("🚀 MOTOR ARGENVIL TENOR V4 - Juan ahora sabe que hay Dulce de Leche.");
});