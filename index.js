import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message || '';

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'mistral',
        prompt: userMessage,
        stream: false
      })
    });

    const data = await ollamaResponse.json();
    res.json({ reply: data.response });
  } catch (error) {
    console.error('Erreur lors de l’appel à Ollama:', error);
    res.status(500).json({ reply: 'Erreur côté serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur IA lancé sur le port ${PORT}`);
});