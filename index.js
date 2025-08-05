import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import OpenAI from 'openai';

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ask', async (req, res) => {
  const { message } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error('Erreur OpenAI :', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.get('/', (req, res) => {
  res.send('Serveur GoWeb Chatbot IA en ligne.');
});

app.listen(port, () => {
  console.log(`✅ Serveur IA lancé sur le port ${port}`);
});
