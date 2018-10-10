const express = require('express');
const router = express.Router();
const roster = require("../actions/roster");

router.post('/update', function(req, res, next) {
  roster.update()
  .then(data => {
    res.redirect("/");
  })
  .catch(e => {
    res.send(e);
  });
});

router.post("/add", function(req, res, next) {
  roster.add({name: req.body.newPlayerName, role: req.body.newPlayerRole})
  .then(data => {
    res.redirect("/");
  })
});

router.post("/remove/:name", function(req, res, next){
  roster.remove(req.params.name)
  .then(data => {
    res.redirect("/");
  })
});

router.post("/commentaries", (req, res, next) => {
  console.log(req.body);
  roster.setCommentaries(req.body.commentaries)
  .then(data => {
    res.redirect("/");
  })
})

module.exports = router;
