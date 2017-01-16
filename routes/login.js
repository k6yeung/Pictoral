/**
 * Created by kyleyeung on 2017-01-16.
 */
var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', {});
});

module.exports = router;
