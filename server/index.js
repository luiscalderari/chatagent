require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/config', require('./routes/config'));

const { handleIncomingMessage } = require('./webhookHandler');
app.post('/webhook/whatsapp', handleIncomingMessage);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
