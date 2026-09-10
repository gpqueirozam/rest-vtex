require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Libera CORS para a página consumir esta API. Se um dia hospedar o front-end
// em outro domínio, troque '*' pela origem específica (ex.: 'https://seu-dominio.com').
app.use(cors());

// Serve a página estática (public/index.html) neste mesmo servidor.
app.use(express.static(path.join(__dirname, 'public')));

const ENVIRONMENTS = {
  prod: {
    name: 'Produção',
    url: 'https://wkrtswcddl.execute-api.us-east-2.amazonaws.com/vtex/rest/',
    headers: {
      Authorization: process.env.PROD_AUTH_HEADER
    }
  },
  hom: {
    name: 'Homologação',
    url: 'https://htztymyfp1.execute-api.us-east-2.amazonaws.com/hom/rest/',
    headers: {
      'x-api-key': process.env.HOM_API_KEY
    }
  }
};

app.get('/api/status/:env', async (req, res) => {
  const env = ENVIRONMENTS[req.params.env];
  if (!env) {
    return res.status(404).json({ error: 'ambiente desconhecido' });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(env.url, {
      method: 'GET',
      headers: env.headers,
      signal: controller.signal
    });
    clearTimeout(timeout);
    return res.json({
      env: req.params.env,
      name: env.name,
      httpCode: response.status,
      ok: response.status === 200,
      checkedAt: new Date().toISOString()
    });
  } catch (err) {
    clearTimeout(timeout);
    return res.json({
      env: req.params.env,
      name: env.name,
      httpCode: 0,
      ok: false,
      error: err.name === 'AbortError' ? 'timeout' : 'falha de conexão',
      checkedAt: new Date().toISOString()
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
