# 🎧 Heldyn AI - High-Fidelity E-commerce Consultant

**Role:** Backend & AI Solutions Architect  
**Project Type:** Niche E-commerce Infrastructure  
**Status:** 🟢 Production Ready (Express Architecture)

## 🧠 System Overview
Heldyn AI es un consultor élite desarrollado para la industria del Audio Hi-Fi. A diferencia de un bot de ventas estándar, este sistema implementa un **filtro técnico implacable** (Filosofía Anti-Humo) para asesorar a audiófilos basándose estrictamente en datos técnicos de laboratorio, eliminando el marketing engañoso del proceso de venta.

---

## ⚡ Key Technical Features (Advanced Multimedia Stack)

### 1. Audio Processing Engine (FFmpeg)
- El sistema es capaz de recibir **notas de voz de WhatsApp**, procesarlas en el servidor usando un contenedor con `fluent-ffmpeg`, normalizar el audio y enviarlo a la API de Gemini para una transcripción y análisis de intención con precisión superior al 95%.

### 2. Dual-Brain Strategy & Fallback
- Implementación de ruteo inteligente: El sistema utiliza **Gemini 3 Flash Preview** como motor primario para una respuesta instantánea y conmuta automáticamente a **Gemini 2.5 Flash** en caso de latencia de red o límites de cuota, garantizando disponibilidad 24/7.

### 3. Atomic Transaction Control
- Uso de **transacciones atómicas en Firebase Firestore** para prevenir el procesamiento de mensajes duplicados (Race Conditions), una característica crítica en entornos de alta concurrencia de WhatsApp para evitar respuestas múltiples al mismo usuario.

### 4. Embedded Catalog Knowledge (Anti-Hallucination)
- Inyección dinámica de conocimiento desde **Google Sheets** con una capa de seguridad que bloquea cualquier mención de productos fuera del inventario verificado, protegiendo la reputación del comercio.

### 5. Omnichannel Mirroring (Chatwoot)
- Sincronización total de eventos: envía textos, audios transcritos y fotos directamente a una instancia de Chatwoot, permitiendo que un experto humano tome el control del chat en vivo con un solo clic.

---

## 🛠️ Tech Stack
- **Backend:** Node.js (v20+) / Express (Ultra-fast routing).
- **Multimedia:** FFmpeg Installer / Fluent-FFMPEG.
- **AI Brain:** Google Gemini 1.5 & 2.5 Family.
- **Data:** Firebase Firestore (Real-time persistency) & Sheets API.
- **Ops:** Cloud Run / Railway Deployment.

---

## 📁 Repository Contents (Sanitized)
- `package.json`: Orquestación de dependencias para procesamiento multimedia.
- `error_handler.js`: Versión 4.0 "Chismoso Total" con monitoreo profundo de logs para debug en producción.
