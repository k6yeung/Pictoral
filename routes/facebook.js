var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    if (req.session.user == null){
        // if user is not logged-in redirect back to login page //
        res.redirect('/');
    }	else{
        res.render('facebook', {});
    }
});

module.exports = router;
