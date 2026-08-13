import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // AI District Analysis endpoint
  app.post('/api/district-insight', async (req, res) => {
    const { districtName, code, psf, yieldVal, yoy, affordability } = req.body;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          insight: `[Market Summary for ${code} - ${districtName}]: Median price sits at $${psf} PSF with a ${yieldVal}% rental yield and ${yoy}% YoY capital growth. Strong local demand and high income multiple (${affordability}x) maintain defensive investment status.`,
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a top Singapore real estate analyst for PropIntel SG. Provide a concise 2-sentence executive investment analysis for District ${code} (${districtName}). Median PSF: $${psf}, Rental Yield: ${yieldVal}%, YoY Growth: ${yoy}%, Affordability Multiple: ${affordability}x. Be professional, analytical, and direct.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const insight = response.text || `District ${code} shows stable $${psf} PSF pricing with a solid ${yieldVal}% rental yield.`;
      res.json({ insight });
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      res.json({
        insight: `District ${code} (${districtName}) maintains a $${psf} PSF median and ${yieldVal}% average rental yield. Ideal for yield-focused investors and long-term capital retention.`,
      });
    }
  });

  // Vite Middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PropIntel SG Server running on http://localhost:${PORT}`);
  });
}

startServer();
