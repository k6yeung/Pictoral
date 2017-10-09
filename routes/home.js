var express = require('express');
var router = express.Router();

/* GET home page. */

// logged-in user homepage //

/* GET login page. */
router.get('/', function(req, res, next) {
    if (req.session.user == null){
        // if user is not logged-in redirect back to login page //
        res.redirect('/');
    }	else{
        res.render('home', {});
    }
});

module.exports = router;
