require('dotenv').config();
const express = require('express');
const path = require('path');
const basicAuth = require('basic-auth');
const userManager = require('./services/UserManager');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Dynamic method calls based on route param (unvalidated)
app.route('/v1/user/:id/:action')
  .get((req, res) => {
      const { id, action } = req.params;
      const result = userManager[action]({ id, ...req.body });
      res.json(result);
  })
  .post((req, res) => {
    try {
      const { id, action } = req.params;
      const params = { id, ...req.body };
      const result = userManager[action](params);
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Basic Auth middleware
function requireAdmin(req, res, next) {
  const creds = basicAuth(req) || {};
  if (
    creds.name === process.env.BASIC_USER &&
    creds.pass === process.env.BASIC_PASS
  ) return next();

  res.set('WWW-Authenticate', 'Basic realm="Admin Area"');
  res.status(401).send('Authentication required.');
}

// Authenticated DELETE
app.delete('/v1/user/:id', requireAdmin, (req, res) => {
  try {
    const { id } = req.params;
    const result = userManager._admin_delete({ id });
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Authenticated DELETE
app.get('/v1/user/list', requireAdmin, (req, res) => {
  try {
    const result = userManager._admin_list();
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 BackOFFice Balm listening on port ${process.env.PORT}`);
});
