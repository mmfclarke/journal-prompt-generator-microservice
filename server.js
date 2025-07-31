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

// GET /prompts endpoint - exactly as requested in your documents
app.get('/prompts', async (req, res) => {
  try {
    console.log('Generating journal prompts...');
    
    // AI prompt as specified in your documents
    const prompt = "Generate 3 journal prompts on the themes of exploring feelings and emotions, self-discovery, and gratitude. Send only the prompts and nothing else. Do not ask the user any follow up questions.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Send response as string (as specified in documents)
    res.send(text);
    
  } catch (error) {
    console.error('Error:', error);
    
    // Return fallback prompts if AI fails
    const fallbackResponse = fallbackPrompts.join('\n');
    res.send(fallbackResponse);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'journal-prompt-generator' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Journal Prompt Generator Microservice',
    endpoints: {
      prompts: 'GET /prompts',
      health: 'GET /health'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Gemini API configured: ${!!process.env.GEMINI_API_KEY}`);
});