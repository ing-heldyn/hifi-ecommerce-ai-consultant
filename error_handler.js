/**
 * HELDYN AI – Error Handler v4.0 (VERSIÓN "CHISMOSO TOTAL" 🕵️‍♂️)
 * Loguea ABSOLUTAMENTE TODO en Cloud Run.
 * Diseñado para la nueva arquitectura Express ultra-rápida.
 */

const axios = require('axios');
const util  = require('util');

// ─── Ocultar datos sensibles en logs ────────────────────────────────────────
function maskSecrets(data) {
    let str = typeof data === 'string' ? data : util.inspect(data, { depth: 4 });
    return str
        .replace(/(Bearer\s+)[A-Za-z0-9\-_]+/gi, '$1[*** TOKEN OCULTO ***]')
        .replace(/("api_access_token"|api_access_token)[\s:=]+["']?[A-Za-z0-9\-_]+["']?/gi, '$1: "[*** TOKEN OCULTO ***]"')
        .replace(/(key=)[A-Za-z0-9\-_]+/gi, '$1[*** API KEY OCULTA ***]');
}

// ─── Categorías de error hiper-detalladas ──────────────────────────────────
function categorize(error) {
    const msg = (error.message || '').toLowerCase();
    const url = (error.config?.url || '').toLowerCase();
    const status = error.response?.status;

    // Errores de API de Gemini / Google
    if (url.includes('generativelanguage') || url.includes('gemini') || msg.includes('gemini') || msg.includes('google')) {
        if (msg.includes('quota') || status === 429) return '⚠️ GEMINI: SIN CUOTA O LÍMITE DE TASA';
        if (msg.includes('safety') || msg.includes('blocked')) return '🛑 GEMINI: BLOQUEO DE SEGURIDAD (Censura)';
        return '🧠 ERROR GEMINI API';
    }

    // Errores Meta / WhatsApp
    if (url.includes('facebook.com') || url.includes('graph.facebook')) {
        if (status === 400) return '🚫 META: BAD REQUEST (Formato de mensaje inválido)';
        if (status === 401 || status === 403) return '🔑 META: ERROR DE TOKEN WA';
        return '🌐 ERROR META / WHATSAPP';
    }

    // Errores Chatwoot
    if (url.includes('chatwoot') || url.includes(process.env.CHATWOOT_BASE_URL || '')) {
        if (status === 404) return '👻 CHATWOOT: CONTACTO O CONVERSACIÓN NO ENCONTRADA';
        return '💬 ERROR CHATWOOT';
    }

    // Firebase & Sheets
    if (url.includes('googleapis') || url.includes('sheets')) return '📊 ERROR GOOGLE SHEETS';
    if (msg.includes('firestore') || msg.includes('firebase')) return '🔥 ERROR FIREBASE / FIRESTORE';

    // Sistema y Archivos
    if (msg.includes('ffmpeg') || msg.includes('audio') || msg.includes('transcode')) return '🎵 ERROR FFMPEG (Transcripción)';
    if (msg.includes('json') || msg.includes('parse')) return '🔣 ERROR DE PARSEO JSON (Respuesta rota)';
    if (msg.includes('timeout') || msg.includes('econnreset') || msg.includes('etimedout')) return '⏱️ TIMEOUT DE RED (Servidor externo no responde)';
    
    // Transacciones y Duplicados
    if (error.code === 6 || msg.includes('already exists')) return '♻️ DUPLICADO (Filtro Atómico actuó)';

    return '💻 ERROR DE LÓGICA INTERNA / CÓDIGO JS';
}

// ─── Autopsia profunda del error ──────────────────────────────────────────
function extractDetail(error) {
    const lines = [];

    // Errores de Red (Axios)
    if (error.isAxiosError || error.response) {
        const status   = error.response?.status;
        const url      = error.config?.url || 'URL desconocida';
        const method   = (error.config?.method || 'GET').toUpperCase();
        
        lines.push(`📡 MÉTODO:   ${method}`);
        lines.push(`🔗 URL:      ${maskSecrets(url)}`);
        lines.push(`🚦 STATUS:   ${status || 'Sin respuesta (Timeout/Red)'}`);

        // ¿Qué intentamos enviar? (Payload)
        if (error.config?.data) {
            lines.push(`📤 ENVIAMOS:`);
            lines.push(maskSecrets(error.config.data).substring(0, 1000)); 
        }

        // ¿Qué nos respondió el servidor?
        if (error.response?.data) {
            lines.push(`📥 RESPUESTA DEL SERVIDOR:`);
            const bodyStr = typeof error.response.data === 'object' 
                ? JSON.stringify(error.response.data, null, 2) 
                : String(error.response.data);
            lines.push(maskSecrets(bodyStr).substring(0, 1000));
        }

        if (error.message) lines.push(`📝 MENSAJE:  ${error.message}`);

    } else if (error.stack) {
        // Error de código (Crash interno)
        lines.push(`💥 CRASH TRACE:`);
        const stackLines = error.stack.split('\n').slice(0, 10); // Las primeras 10 líneas del stack
        lines.push(...stackLines);
    } else {
        // Error genérico
        lines.push(`❓ OBJETO RAW:`);
        lines.push(maskSecrets(util.inspect(error, { depth: 3 })).substring(0, 1500));
    }

    return lines.join('\n');
}

// ─── Constructor del reporte ───────────────────────────────────────────────
function buildReport(error, context) {
    const type   = categorize(error);
    const detail = extractDetail(error);
    const hora   = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });

    const waMsg = [
        `🕵️‍♂️ *HELDYN AI – CHISMOSO SYSTEM*`,
        ``,
        `🚨 *Categoría:* ${type}`,
        `📍 *Lugar:*     ${context}`,
        `🕒 *Hora PE:*  ${hora}`,
        ``,
        `❌ *Detalle Clínico:*`,
        detail
    ].join('\n');

    const consoleMsg = waMsg.replace(/\*/g, '');

    return { type, waMsg, consoleMsg };
}

// ─── API Principal ────────────────────────────────────────────────────────
const errorHandler = {

    /**
     * Reporta un error de forma agresiva.
     * Si no hay config de WA, igual ensucia la consola de Cloud Run para que lo veas.
     */
    async notifyError(error, context, adminNumber = null, whatsappToken = null, phoneId = null) {
        
        // Silenciar mensajes duplicados en WA (pero dejarlos en consola suavemente)
        if (error?.code === 6) {
            console.log(`♻️ [Filtro Atómico] Mensaje descartado en: ${context}`);
            return;
        }

        const { type, waMsg, consoleMsg } = buildReport(error, context);

        // ── Consola Cloud Run (Colorido y visible) ─────────────────────────
        console.error('\n' + '━'.repeat(60));
        console.error(`💥 HELDYN AI ALERTA CRÍTICA 💥`);
        console.error('━'.repeat(60));
        console.error(consoleMsg);
        console.error('━'.repeat(60) + '\n');

        // ── Envío por WhatsApp ─────────────────────────────────────────────
        const cleanAdmin = adminNumber ? String(adminNumber).replace(/\D/g, '') : process.env.ADMIN_NUMBER;
        const wToken = whatsappToken || process.env.WHATSAPP_TOKEN;
        const pId = phoneId || process.env.PHONE_NUMBER_ID;

        if (!cleanAdmin || !wToken || !pId) return; // Faltan datos para enviar a WA

        try {
            await axios.post(
                `https://graph.facebook.com/v18.0/${pId}/messages`,
                {
                    messaging_product: 'whatsapp',
                    to: cleanAdmin,
                    type: 'text',
                    text: { body: waMsg.substring(0, 4000) } // Límite de WA
                },
                {
                    headers: { Authorization: `Bearer ${wToken}` },
                    timeout: 5000
                }
            );
        } catch (sendErr) {
            console.error('‼️ CHISMOSO FAILED: No se pudo avisar al Admin por WA. Razón:', sendErr.message);
        }
    },

    /**
     * FUNCIÓN CHISMOSA: Úsala en tu index.js para rastrear variables o flujos.
     * Ejemplo: errorHandler.gossip("Cerebro Gemini", "Datos enviados a la IA", userData);
     */
    gossip(context, message, data = null) {
        const hora = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' });
        console.log(`\n🕵️‍♂️ [${hora}] [${context.toUpperCase()}] ${message}`);
        if (data) {
            console.log('📦 DATOS INSPECCIONADOS:');
            console.log(maskSecrets(util.inspect(data, { showHidden: false, depth: null, colors: true })));
            console.log('──────────────────────────────────────────────────');
        }
    }
};

module.exports = errorHandler;
