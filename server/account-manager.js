
var crypto 		= require('crypto');
var MongoDB 	= require('mongodb').Db;
var Server 		= require('mongodb').Server;
var moment 		= require('moment');

/*
	Establish DB connection
*/

var dbName = process.env.DB_NAME || 'PictoralDB'; // setting the database name
var dbHost = process.env.DB_HOST || 'localhost';  // database host
var dbPort = process.env.DB_PORT || 27017; 		  // database port

 /**

        Creates a new database

         * @param dbHost is the database host

         * @param dbPort is the port that the database is using

         */

var db = new MongoDB(dbName, new Server(dbHost, dbPort, {auto_reconnect: true}), {w: 1});
db.open(function(e, d){
	if (e) {
		console.log(e);
	} else {
		if (process.env.NODE_ENV == 'live') {
			db.authenticate(process.env.DB_USER, process.env.DB_PASS, function(e, res) {
				if (e) {
					console.log('mongo :: error: not authenticated', e); //if there is an error connecting to the DB
				}
				else {
					console.log('mongo :: authenticated and connected to database :: "'+dbName+'"'); // DB is connected
				}
			});
		} else {
			console.log('mongo :: connected to database :: "'+dbName+'"'); //If DB is already connected
		}
	}
});

var accounts = db.collection('accounts');

 /**

         Used to Validate Login Automatically

         * @param user username of the account

         * @param pass password of the account

         */

exports.autoLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) {
		if (o){
			o.pass == pass ? callback(o) : callback(null);
		}	else{
			callback(null);
		}
	});
}

/**

         Used to Validate Login Manually 

         * @param user username that the user enters

         * @param pass password that the user enters
		 

         */

exports.manualLogin = function(user, pass, callback)
{
	accounts.findOne({user:user}, function(e, o) { 
		if (o == null){						// user name cannot be found in the DB
			callback('user-not-found');
		}	else{
			validatePassword(pass, o.pass, function(err, res) {
				if (res){					// password does not match
					callback(null, o);
				}	else{
					callback('invalid-password');
				}
			});
		}
	});
}

/**

         Used for adding new Accounts

         * @param newData used to specify that this is new data that is being inputted into the DB

         */

exports.addNewAccount = function(newData, callback)
{
	accounts.findOne({user:newData.user}, function(e, o) {
		if (o){								// user name is already on the DB and therefore invalid
			callback('username-taken');
		}	else{							// hash the password and create a timestamp of when it was created
			saltAndHash(newData.pass, function(hash){
				newData.pass = hash;
				// append date stamp when record was created //
				newData.date = moment().format('MMMM Do YYYY, h:mm:ss a');
				accounts.insert(newData, {safe: true}, callback);
                // callback('signup-successful');
			});
		}
	});
}

/**

         Generate a salt that is used for password validation

         */

var generateSalt = function()
{
	var set = '0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ';
	var salt = '';
	for (var i = 0; i < 10; i++) {
		var p = Math.floor(Math.random() * set.length);
		salt += set[p];
	}
	return salt;
}
/**

         Creating a hash for encryption 
		 
         */

var md5 = function(str) {
	return crypto.createHash('md5').update(str).digest('hex');
}
/**

         Use both the salt and hash for passwords

         * @param pass user's password

         */
var saltAndHash = function(pass, callback)
{
	var salt = generateSalt();
	callback(salt + md5(pass + salt));
}
/**

         validate the password after the hash + salt 

         * @param plainPass user's password

         * @param hashedPass password that has been hashed

         */
var validatePassword = function(plainPass, hashedPass, callback)
{
	var salt = hashedPass.substr(0, 10);
	var validHash = salt + md5(plainPass + salt);
	callback(null, hashedPass === validHash);
}

var getObjectId = function(id)
{
	return new require('mongodb').ObjectID(id);
}

var findById = function(id, callback)
{
	accounts.findOne({_id: getObjectId(id)},
		function(e, res) {
		if (e) callback(e)
		else callback(null, res)
	});
}

var findByMultipleFields = function(a, callback)
{
// this takes an array of name/val pairs to search against {fieldName : 'value'} //
	accounts.find( { $or : a } ).toArray(
		function(e, results) {
		if (e) callback(e)
		else callback(null, results)
	});
}
