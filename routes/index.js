const express = require('express');
const router = express.Router();
const roster = require("../actions/roster");
const moment = require("moment");

/* GET home page. */
router.get('/', function(req, res, next) {
  roster.get()
  .then(data => {
    const lastUpdateDelta = moment.duration(moment().diff(moment(data.lastUpdate)));

    res.render('index', {
      "data": data,
      "lastUpdateSince": lastUpdateDelta.days()+" jours, " + lastUpdateDelta.hours()+"h  "+lastUpdateDelta.minutes()+"m "+lastUpdateDelta.seconds()+"s"});
  });
});

module.exports = router;
