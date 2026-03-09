const axios = require('axios');
const db = require('./db');

async function handleIncomingMessage(req, res) {
    const { instance, data } = req.body;
    const message = data.message;
    const remoteJid = data.key.remoteJid;

    if (!message || data.key.fromMe) return res.sendStatus(200);

    const text = message.conversation || message.extendedTextMessage?.text;
    if (!text) return res.sendStatus(200);

    try {
        // Get config
        const config = await new Promise((resolve, reject) => {
            db.get(`SELECT * FROM config WHERE id = 1`, (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (!config || !config.openai_key) return res.sendStatus(200);

        // Call OpenAI
        const aiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: config.training_data || "Você é um assistente prestativo." },
                { role: "user", content: text }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${config.openai_key}` }
        });

        const reply = aiResponse.data.choices[0].message.content;

        // Send back to WhatsApp via Evolution API
        await axios.post(`${config.evolution_api_url}/message/sendText/${config.evolution_instance_name}`, {
            number: remoteJid,
            text: reply
        }, {
            headers: { 'apikey': config.evolution_api_key }
        });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error processing message:', error.response?.data || error.message);
        res.sendStatus(500);
    }
}

module.exports = { handleIncomingMessage };
