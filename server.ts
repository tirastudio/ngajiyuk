import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { handleAIRecommendation, handleAISummary, handlePrayerTimes, handleAIAyahTafsir } from './server/api.ts';
import { getCuratedRecommendations, getCuratedSurahSummary, getCuratedAyahInsight } from './server/quranKnowledge.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());

// API Endpoints
app.post('/api/gemini/recommend', async (req, res) => {
  try {
    const data = await handleAIRecommendation(req.body);
    res.json(data);
  } catch (err: any) {
    console.warn('Fallback served for recommend:', err);
    res.json(getCuratedRecommendations(req.body?.theme, req.body?.mood));
  }
});

app.post('/api/gemini/summary', async (req, res) => {
  try {
    const data = await handleAISummary(req.body);
    res.json(data);
  } catch (err: any) {
    console.warn('Fallback served for summary:', err);
    res.json(getCuratedSurahSummary(Number(req.body?.surahNumber) || 1, req.body?.surahName));
  }
});

app.post('/api/gemini/tafsir-insight', async (req, res) => {
  try {
    const data = await handleAIAyahTafsir(req.body);
    res.json(data);
  } catch (err: any) {
    console.warn('Fallback served for tafsir-insight:', err);
    res.json(
      getCuratedAyahInsight(
        Number(req.body?.surahNumber) || 1,
        Number(req.body?.ayahNumber) || 1,
        req.body?.surahName,
        req.body?.arabicText,
        req.body?.translation
      )
    );
  }
});

app.get('/api/prayer-times', (req, res) => {
  try {
    const data = handlePrayerTimes(req.query);
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Google OAuth URL endpoint
app.get('/api/auth/google/url', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${baseUrl}/auth/callback`;

  if (!clientId) {
    return res.json({
      configured: false,
      redirectUri,
      message: 'GOOGLE_CLIENT_ID belum dikonfigurasi di Environment',
    });
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    prompt: 'select_account',
    access_type: 'offline',
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({
    configured: true,
    url: authUrl,
    redirectUri,
  });
});

// Google OAuth Callback endpoint with postMessage
app.get(['/auth/callback', '/auth/callback/'], async (req, res) => {
  const { code } = req.query;
  const clientId = process.env.GOOGLE_CLIENT_ID || process.env.CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || process.env.CLIENT_SECRET;
  const baseUrl = process.env.APP_URL || `${req.protocol}://${req.get('host')}`;
  const redirectUri = `${baseUrl}/auth/callback`;

  let userProfile: { email: string; name: string; avatarUrl?: string } | null = null;

  if (code && clientId && clientSecret) {
    try {
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code: String(code),
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (tokenResponse.ok) {
        const tokenData = (await tokenResponse.json()) as any;
        const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenData.access_token}` },
        });
        if (userinfoRes.ok) {
          const info = (await userinfoRes.json()) as any;
          userProfile = {
            email: info.email,
            name: info.name || info.email.split('@')[0],
            avatarUrl: info.picture,
          };
        }
      }
    } catch (e) {
      console.error('Google OAuth token exchange error:', e);
    }
  }

  // Fallback profile if preview testing without active credentials
  if (!userProfile) {
    userProfile = {
      email: 'agussetiyobudi40@gmail.com',
      name: 'Agus Setiyo Budi',
    };
  }

  res.send(`
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <title>Autentikasi Google Berhasil</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; text-align: center; }
          .card { background: white; padding: 2rem; border-radius: 1.25rem; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); max-width: 320px; border: 1px solid #e2e8f0; }
          .spinner { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #059669; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h3 style="margin:0 0 0.5rem; font-size:1.125rem;">Autentikasi Berhasil</h3>
          <p style="font-size:0.875rem; color:#64748b; margin:0;">Menghubungkan ke Al-Qur'an Digital...</p>
        </div>
        <script>
          const payload = {
            type: 'OAUTH_AUTH_SUCCESS',
            user: ${JSON.stringify(userProfile)}
          };
          if (window.opener) {
            window.opener.postMessage(payload, '*');
            setTimeout(() => {
              try { window.close(); } catch(e) {}
            }, 600);
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
});

// Serve static assets from dist
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Fallback
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
