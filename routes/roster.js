const express = require('express');
const router = express.Router();
const roster = require("../actions/roster");

router.post('/update', function(req, res, next) {
  roster.update()
  .then(data => {
    res.redirect("/");
  });
});

module.exports = router;
