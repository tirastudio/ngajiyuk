import { handleAIRecommendation, handleAISummary, handlePrayerTimes, handleAIAyahTafsir } from '../../server/api.ts';
import { getCuratedRecommendations, getCuratedSurahSummary, getCuratedAyahInsight } from '../../server/quranKnowledge.ts';

interface NetlifyEvent {
  path: string;
  httpMethod: string;
  headers: Record<string, string | undefined>;
  queryStringParameters?: Record<string, string | undefined>;
  body?: string | null;
  isBase64Encoded?: boolean;
}

export const handler = async (event: NetlifyEvent) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Preflight request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers,
      body: '',
    };
  }

  const rawPath = (event.path || '').toLowerCase();
  const action = (event.queryStringParameters?.action || '').toLowerCase();

  let body: any = {};
  if (event.body) {
    try {
      const decodedBody = event.isBase64Encoded
        ? Buffer.from(event.body, 'base64').toString('utf-8')
        : event.body;
      body = JSON.parse(decodedBody);
    } catch {
      body = {};
    }
  }

  try {
    // 1. AI Recommendation endpoint
    if (
      rawPath.includes('gemini/recommend') ||
      rawPath.endsWith('/recommend') ||
      action === 'recommend'
    ) {
      try {
        const data = await handleAIRecommendation(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (err: any) {
        console.warn('Fallback served for Netlify recommend:', err);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(getCuratedRecommendations(body?.theme, body?.mood)),
        };
      }
    }

    // 2. AI Summary endpoint
    if (
      rawPath.includes('gemini/summary') ||
      rawPath.endsWith('/summary') ||
      action === 'summary'
    ) {
      try {
        const data = await handleAISummary(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (err: any) {
        console.warn('Fallback served for Netlify summary:', err);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(getCuratedSurahSummary(Number(body?.surahNumber) || 1, body?.surahName)),
        };
      }
    }

    // 3. AI Tafsir Insight endpoint
    if (
      rawPath.includes('gemini/tafsir-insight') ||
      rawPath.endsWith('/tafsir-insight') ||
      action === 'tafsir-insight'
    ) {
      try {
        const data = await handleAIAyahTafsir(body);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data),
        };
      } catch (err: any) {
        console.warn('Fallback served for Netlify tafsir-insight:', err);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(
            getCuratedAyahInsight(
              Number(body?.surahNumber) || 1,
              Number(body?.ayahNumber) || 1,
              body?.surahName,
              body?.arabicText,
              body?.translation
            )
          ),
        };
      }
    }

    // 4. Prayer times endpoint
    if (
      rawPath.includes('prayer-times') ||
      action === 'prayer-times'
    ) {
      const city = event.queryStringParameters?.city || 'jakarta';
      const data = handlePrayerTimes({ city });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: `Endpoint not found: ${rawPath}` }),
    };
  } catch (error: any) {
    console.error('Netlify function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error?.message || 'Internal Server Error' }),
    };
  }
};
