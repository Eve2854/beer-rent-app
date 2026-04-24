import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://cervezamond.netlify.app',
  'https://beer-rent-app.vercel.app',
  'https://cervezamond.com.ar',
  'https://www.cervezamond.com.ar',
];

app.use(express.json());
app.use(cors({ origin: allowedOrigins }));

const accessToken = process.env.MP_ACCESS_TOKEN;
if (!accessToken) {
  console.warn('MP_ACCESS_TOKEN no esta definido en server/.env');
}

const mp = new MercadoPagoConfig({ accessToken });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const TOKEN_PATH = path.join(__dirname, '..', 'data', 'google_tokens.json');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'primary';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3001/api/google/oauth2callback';
const GOOGLE_REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN;

const ensureTokenDir = () => {
  const dir = path.dirname(TOKEN_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

const getOAuthClient = () => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return null;
  }
  return new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
};

const loadTokens = () => {
  if (!fs.existsSync(TOKEN_PATH)) return null;
  const raw = fs.readFileSync(TOKEN_PATH, 'utf-8');
  return JSON.parse(raw);
};

const saveTokens = (tokens) => {
  ensureTokenDir();
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
};

const getTokens = () => {
  // En hosts con filesystem efímero (Render free), el archivo puede perderse.
  // Si hay refresh token en env, eso alcanza para refrescar access tokens.
  const fileTokens = (() => {
    try {
      return loadTokens();
    } catch (_e) {
      return null;
    }
  })();

  if (fileTokens) return fileTokens;
  if (GOOGLE_REFRESH_TOKEN) return { refresh_token: GOOGLE_REFRESH_TOKEN };
  return null;
};

app.get('/api/google/auth/url', (_req, res) => {
  const oauth2Client = getOAuthClient();
  if (!oauth2Client) {
    return res.status(500).json({ error: 'GOOGLE_CLIENT_ID/SECRET no configurados.' });
  }
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.events'],
  });
  return res.json({ url });
});

app.get('/api/google/oauth2callback', async (req, res) => {
  try {
    const oauth2Client = getOAuthClient();
    if (!oauth2Client) {
      return res.status(500).send('Credenciales de Google no configuradas.');
    }
    const code = req.query.code;
    if (!code) return res.status(400).send('Codigo no recibido.');
    const { tokens } = await oauth2Client.getToken(code);
    // No pisar refresh_token si Google no lo devuelve en re-autorizaciones.
    const prev = (() => {
      try {
        return loadTokens();
      } catch (_e) {
        return null;
      }
    })();
    const merged = { ...(prev || {}), ...(tokens || {}) };
    saveTokens(merged);
    return res.redirect(`${FRONTEND_URL}/?gcal=connected`);
  } catch (err) {
    return res.status(500).send('Error conectando Google Calendar.');
  }
});

app.post('/api/google/calendar/event', async (req, res) => {
  try {
    const oauth2Client = getOAuthClient();
    if (!oauth2Client) {
      return res.status(500).json({ error: 'GOOGLE_CLIENT_ID/SECRET no configurados.' });
    }
    const tokens = getTokens();
    if (!tokens) {
      return res.status(401).json({ error: 'Google Calendar no conectado.' });
    }
    oauth2Client.setCredentials(tokens);

    const { summary, description, location, start, end, timeZone } = req.body || {};
    if (!summary || !start || !end) {
      return res.status(400).json({ error: 'Datos incompletos para crear evento.' });
    }

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    const event = {
      summary,
      description,
      location,
      start: { dateTime: start, timeZone: timeZone || 'America/Argentina/Buenos_Aires' },
      end: { dateTime: end, timeZone: timeZone || 'America/Argentina/Buenos_Aires' },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'popup', minutes: 10080 },
          { method: 'email', minutes: 10080 },
          { method: 'popup', minutes: 1440 },
          { method: 'email', minutes: 1440 },
        ],
      },
    };

    const result = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: event,
    });

    return res.json({ id: result.data.id, htmlLink: result.data.htmlLink });
  } catch (err) {
    const status = err?.code || err?.response?.status;
    if (status === 401 || status === 403) {
      return res.status(401).json({ error: 'Google Calendar no conectado o credenciales vencidas.' });
    }
    return res.status(500).json({ error: 'Error creando evento en Google Calendar.' });
  }
});

app.post('/api/mercadopago/preference', async (req, res) => {
  try {
    const { title, unit_price, quantity, payer } = req.body || {};

    if (!title || !unit_price || !quantity) {
      return res.status(400).json({ error: 'Datos incompletos para crear preferencia.' });
    }

    const preference = new Preference(mp);
    const backUrls = {
      success: process.env.MP_BACK_URL_SUCCESS || 'http://localhost:5173/',
      pending: process.env.MP_BACK_URL_PENDING || 'http://localhost:5173/',
      failure: process.env.MP_BACK_URL_FAILURE || 'http://localhost:5173/',
    };

    const result = await preference.create({
      body: {
        items: [
          {
            title,
            unit_price: Number(unit_price),
            quantity: Number(quantity),
            currency_id: 'ARS',
          },
        ],
        payer: payer || undefined,
        back_urls: backUrls,
      },
    });

    return res.json({
      id: result.id,
      init_point: result.init_point,
      sandbox_init_point: result.sandbox_init_point,
    });
  } catch (error) {
    const details = {
      message: error?.message || 'Error desconocido',
      status: error?.status || error?.response?.status,
      cause: error?.cause || error?.response?.data,
    };
    console.error('Error Mercado Pago:', details);
    return res.status(500).json({ error: 'Error creando preferencia de pago.', details });
  }
});


app.get('/health', (_req, res) => res.json({ ok: true }));

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Servidor Mercado Pago listo en http://localhost:${port}`);
});
