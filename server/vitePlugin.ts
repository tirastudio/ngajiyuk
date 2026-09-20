import { Plugin } from 'vite';
import { handleAIRecommendation, handleAISummary, handlePrayerTimes, handleAIAyahTafsir } from './api.ts';
import { getCuratedRecommendations, getCuratedSurahSummary, getCuratedAyahInsight } from './quranKnowledge.ts';

export function quranApiPlugin(): Plugin {
  return {
    name: 'vite-plugin-quran-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const urlObj = new URL(req.url, 'http://localhost:3000');
        const pathname = urlObj.pathname;

        res.setHeader('Content-Type', 'application/json');

        try {
          if (pathname === '/api/gemini/recommend' && req.method === 'POST') {
            const body = await readJsonBody(req);
            const data = await handleAIRecommendation(body);
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          }

          if (pathname === '/api/gemini/summary' && req.method === 'POST') {
            const body = await readJsonBody(req);
            const data = await handleAISummary(body);
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          }

          if (pathname === '/api/gemini/tafsir-insight' && req.method === 'POST') {
            const body = await readJsonBody(req);
            const data = await handleAIAyahTafsir(body);
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          }

          if (pathname === '/api/prayer-times' && req.method === 'GET') {
            const city = urlObj.searchParams.get('city') || 'jakarta';
            const data = handlePrayerTimes({ city });
            res.statusCode = 200;
            res.end(JSON.stringify(data));
            return;
          }

          // If no route matched
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Endpoint not found' }));
        } catch (error: any) {
          console.error('API Middleware Caught Error, serving verified fallback:', error);
          if (pathname === '/api/gemini/recommend') {
            res.statusCode = 200;
            res.end(JSON.stringify(getCuratedRecommendations()));
            return;
          }
          if (pathname === '/api/gemini/summary') {
            res.statusCode = 200;
            res.end(JSON.stringify(getCuratedSurahSummary(1, 'Al-Fatihah')));
            return;
          }
          if (pathname === '/api/gemini/tafsir-insight') {
            res.statusCode = 200;
            res.end(JSON.stringify(getCuratedAyahInsight(1, 1, 'Al-Fatihah')));
            return;
          }
          res.statusCode = 500;
          res.end(JSON.stringify({ error: error?.message || 'Internal Server Error' }));
        }
      });
    },
  };
}

function readJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', (err: any) => reject(err));
  });
}
