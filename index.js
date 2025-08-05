import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

// Configuration OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

// Route POST /ask
app.post('/ask', async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo", // ou autre selon ton quota
      messages: [
        { role: "system", content: "Tu es un assistant de GoWeb, une agence web pro." },
        { role: "user", content: userMessage }
      ]
    });

    const botReply = completion.data.choices[0].message.content;
    res.json({ reply: botReply });

  } catch (error) {
    console.error("Erreur OpenAI :", error);
    res.status(500).json({ reply: "Erreur côté serveur." });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur IA lancé sur le port ${port}`);
});
