const jwt = require('jsonwebtoken');
var redis = require('redis');
let client = redis.createClient(); //creates a new client

client.on('error', (err) => console.log('Redis Client Error', err));

async function connect() {
	await client.connect();
	console.log('Connected to Redis');
}

connect();

async function set(key, value) {
    await client.set(key, value);
}

async function get(key) {
    const value = await client.get('key');
    console.log(value);
}

async function increment(key){
	await client.incr(key);
}





function createToken(user) {
	return jwt.sign({ id: user.id, username: user.username }, "My so secret sentence");
}

function signin(req, res) {

	let User = require('../models/user');

	User.findOne({ username: req.body.account }, function (err, user) {
		if (err)
			throw err;
		if (user == null) {
			console.log("Je n'ai pas de user");
			res.redirect('/accueil?failed_user');
		}
		else if (user.comparePassword(req.body.password)) {
			req.session.username = req.body.account;
			req.session.logged = true;
			res.redirect("/profile");

			increment(req.body.account);
		}
		else
			res.redirect('/accueil?failed_password');
	});

	
}

function signup(req, res) {

	let User = require('../models/user');
	let user = new User();

	user.username = req.body.account;
	user.password = req.body.password;

	user.save((err, savedUser) => {

		if (err)
			throw err;

        req.session.username = req.body.account;
		req.session.logged = true;

		res.redirect('/profile');

	});

	set(user.username, 1);
}

function signout(req, res) {

	req.session.username = "";
	req.session.logged = false;
	res.redirect("/");

}

function profile(req, res) {

		console.log(req.session.username);
	if (req.session.logged)
		res.redirect("/connected?" + req.session.username);
	else
		res.redirect('/accueil');

}


module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
module.exports.profile = profile;
module.exports.accueil = accueil;