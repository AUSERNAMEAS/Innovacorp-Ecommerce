const express = require('express');
const router = express.Router();
// this route is used to test the session functionality
router.get('/', (req, res) => 
{
  console.log(req.session);
  res.json({ session: req.session });
});

module.exports = router;