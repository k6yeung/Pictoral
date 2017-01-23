/**
 * Created by kyleyeung on 2017-01-16.
 */
var express = require('express');
var router = express.Router();
var AM = require('../server/account-manager');


/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', {});
});

router.post('/', function(req, res){
    AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
        if (!o){
            res.status(400).send(e);
        }	else{
            req.session.user = o;
            res.status(200).send(o);
        }
    });
});


router.post('/signup', function(req, res){
    AM.addNewAccount({
        user 	: req.body['user'],
        pass	: req.body['pass'],
    }, function(e){
        if (e){
            res.status(400).send(e);
        }	else{
            res.status(200).send('ok');
        }
    });
});

module.exports = router;
