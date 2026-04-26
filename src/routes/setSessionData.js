const express = require('express');
const router = express.Router();
// route to set session data
router.get('/api/set-session', (req, res) => 
{
  req.session.usuario = 'Ana';
  req.session.idUsuario = 1;
// u can set any data you want in the session
  res.json({ ok: true, session: req.session });
});