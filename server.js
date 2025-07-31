require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Fallback prompts in case AI fails
const fallbackPrompts = [
  "What emotion dominated your day today, and what might have triggered it?",
  "Describe a moment recently when you felt truly proud of yourself.",
  "List three small things that brought you joy this week."
];

// GET /prompts endpoint
app.get('/prompts', async (req, res) => {
  try {
    console.log('Generating journal prompts...');
    const prompt = `Generate 3 practical and varied journal prompts. Each prompt should be inspired by one or more of the following themes: exploring feelings and emotions, self-discovery, and gratitude. The prompts should be distinct from each other, and you may combine or interpret the themes in creative ways. Avoid metaphors, analogies, or poetic language. Send only the numbered prompts, each on a new line, and nothing else.`;

    // Timeout wrapper (10s)
    const aiPromise = model.generateContent(prompt);
    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), 10000));
    let result, response, text;
    try {
      result = await Promise.race([aiPromise, timeoutPromise]);
      response = await result.response;
      text = await response.text();
    } catch (err) {
      throw err;
    }

    // Parse prompts: split by line, filter empty, trim, dedupe
    let prompts = text.split(/\r?\n/).map(p => p.trim()).filter(Boolean);
    prompts = [...new Set(prompts)];

    // If not exactly 3, fallback
    if (prompts.length !== 3) throw new Error('AI did not return exactly 3 prompts');

    // No previous prompt check; allow any valid set of 3 prompts

    lastPrompts = prompts;
    res.status(200).send(prompts.join('\n'));
  } catch (error) {
    console.error('Error:', error);
    // Return fallback prompts with 500 status
    lastPrompts = fallbackPrompts;
    res.status(500).send(fallbackPrompts.join('\n'));
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', service: 'journal-prompt-generator' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'Journal Prompt Generator Microservice',
    endpoints: {
      prompts: 'GET /prompts',
      health: 'GET /health'
    }
  });
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini API configured: ${!!process.env.GEMINI_API_KEY}`);
});