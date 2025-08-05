// index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GoWeb Chatbot IA fonctionne ✅');
});

app.post('/ask', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo-preview',
        messages: [
          {
            role: 'system',
            content: 'Tu es un expert en développement web. Tu ne réponds qu’aux questions liées à HTML, CSS, JS, Node.js, React, etc.'
          },
          { role: 'user', content: message }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (data.choices && data.choices.length > 0) {
      res.json({ reply: data.choices[0].message.content });
    } else {
      res.status(500).json({ reply: 'Aucune réponse reçue de l’IA.' });
    }

  } catch (error) {
    console.error('Erreur lors de l’appel à OpenAI :', error);
    res.status(500).json({ reply: 'Erreur côté serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur IA lancé sur le port ${PORT}`);
});
