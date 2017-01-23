var express = require('express');
var router = express.Router();

/* GET home page. */

// logged-in user homepage //

router.get('/home', function(req, res) {
    if (req.session.user == null){
        // if user is not logged-in redirect back to login page //
        res.redirect('/');
    }	else{
        res.render('home', {
            title : 'Express'
        });
    }
});


module.exports = router;
