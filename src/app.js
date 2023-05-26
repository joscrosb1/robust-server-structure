const express = require("express");
const urlsData = require("./data/urls-data");
const usesData = require("./data/uses-data");

const app = express();

app.use(express.json());

app.post('/urls', (req, res, next) => {
  const { data: { href } = {} } = req.body;

  if (href) {
    const newUrl = { id: urlsData.length + 1, href };
    urlsData.push(newUrl);
    res.status(201).json({ data: newUrl });
  } else {
    next({ status: 400, message: "Data must include href" });
  }
});

app.get('/urls', (req, res) => {
  res.status(200).json({ data: urlsData });
});

app.all('/urls', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls` });
});

app.get('/urls/:urlId', (req, res, next) => {
  const urlId = Number(req.params.urlId);
  const foundUrl = urlsData.find(url => url.id === urlId);

  if (foundUrl) {
    const newUse = { id: usesData.length + 1, urlId, time: Date.now() };
    usesData.push(newUse);
    res.json({ data: foundUrl });
  } else {
    next({ status: 404, message: `URL id not found: ${urlId}` });
  }
});

app.put('/urls/:urlId', (req, res, next) => {
  const urlId = Number(req.params.urlId);
  const foundUrl = urlsData.find(url => url.id === urlId);

  if (foundUrl) {
    const { data: { href } = {} } = req.body;

    if (href) {
      foundUrl.href = href;
      res.json({ data: foundUrl });
    } else {
      next({ status: 400, message: "Data must include href" });
    }
  } else {
    next({ status: 404, message: `URL id not found: ${urlId}` });
  }
});

app.all('/urls/:urlId', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls/:urlId` });
});

app.get('/urls/:urlId/uses', (req, res, next) => {
  const urlId = Number(req.params.urlId);
  const foundUrl = urlsData.find(url => url.id === urlId);

  if (foundUrl) {
    const urlUses = usesData.filter(use => use.urlId === urlId);
    res.json({ data: urlUses });
  } else {
    next({ status: 404, message: `URL id not found: ${urlId}` });
  }
});

app.all('/urls/:urlId/uses', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls/:urlId/uses` });
});

// Additional routes
app.get('/uses', (req, res) => {
  res.status(200).json({ data: usesData });
});

app.get('/uses/:useId', (req, res, next) => {
  const useId = Number(req.params.useId);
  const foundUse = usesData.find(use => use.id === useId);

  if (foundUse) {
    res.status(200).json({ data: foundUse });
  } else {
    next({ status: 404, message: `Use id not found: ${useId}` });
  }
});

app.delete('/uses/:useId', (req, res, next) => {
  const useId = Number(req.params.useId);
  const index = usesData.findIndex(use => use.id === useId);

  if (index !== -1) {
    usesData.splice(index, 1);
    res.status(204).end();
  } else {
    next({ status: 404, message: `Use id not found: ${useId}` });
  }
});

app.all('/uses', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /uses` });
});


app.get('/urls/:urlId/uses/:useId', (req, res, next) => {
  const useId = Number(req.params.useId);
  const urlId = Number(req.params.urlId);
  const foundUrl = urlsData.find(url => url.id === urlId);
  const foundUse = usesData.find(use => use.id === useId && use.urlId === urlId);

  if (!foundUrl) {
    next({ status: 404, message: `URL id not found: ${urlId}` });
  } else if (foundUse) {
    res.status(200).json({ data: foundUse });
  } else {
    next({ status: 404, message: `Use id not found: ${useId}` });
  }
});

app.put('/urls/:urlId/uses/:useId', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls/:urlId/uses/:useId` });
});

app.post('/urls/:urlId/uses/:useId', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls/:urlId/uses/:useId` });
});

app.delete('/urls/:urlId/uses/:useId', (req, res, next) => {
  const useId = Number(req.params.useId);
  const index = usesData.findIndex(use => use.id === useId);

  if (index !== -1) {
    usesData.splice(index, 1);
    res.status(204).end();
  } else {
    next({ status: 404, message: `Use id not found: ${useId}` });
  }
});

app.all('/urls/:urlId/uses/:useId', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /urls/:urlId/uses/:useId` });
});

app.all('/uses/:useId', (req, res, next) => {
  next({ status: 405, message: `${req.method} not allowed for /uses/:useId` });
});

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({ error: error.message });
});

app.use((req, res) => {
  res.status(404).json({ error: `Resource not found: ${req.path}` });
});

module.exports = app;






