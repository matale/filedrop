#!/usr/bin/env node
const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const log = require('./log');

if (config.dev) {
  log.warn('Running in dev mode');
}

const upload = multer({
  dest: 'tmp/',
});

const app = express();

nunjucks.configure('views', {
  autoescape: true,
  express: app,
  watch: config.dev,
});

app.use(morgan('combined', { stream: log.stream }));

app.use(express.static('public'));

app.post('/file', upload.single('file'), (req, res) => {
  fs.rename(req.file.path, path.join(config.target, req.file.originalname), () => {
    res.send('OK');
  });
});

app.get('/', (req, res) => {
  res.render('index.html');
});

app.listen(config.port, () => {
  log.info(`Listening on http://0.0.0.0:${config.port}`);
});
