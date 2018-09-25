const express = require('express');
const router = express.Router();
const roster = require("../actions/roster");
const moment = require("moment");

/* GET home page. */
router.get('/', function(req, res, next) {
  roster.get()
  .then(data => {
    const lastUpdateDelta = moment(new Date().getTime() - data.lastUpdate);
    res.render('index', { "data": data, "lastUpdateSince": lastUpdateDelta.format("HH:mm:ss")});
  });
});

module.exports = router;
