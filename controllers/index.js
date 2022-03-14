const jwt = require('jsonwebtoken');

function createToken(user) {
	return jwt.sign({ id: user.id, username: user.username }, "My so secret sentence");
}

function signin(req, res) {

	let User = require('../models/user');

	User.findOne({ username: req.body.account }, function (err, user) {
		if (err)
			throw err;

		console.log(req.session);
		console.log(req.body);
		
		if (user == null) {
			console.log("Je n'ai pas de user");
			res.redirect('/accueil?auth=failed');
		}
		else if (user.comparePassword(req.body.password)) {
			console.log(req.session);
			req.session.username = req.body.account;
			req.session.logged = true;
			res.redirect("/connected");
		}
		else
			res.redirect('/accueil');
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

		res.redirect('/connected');

	});
}

function signout(req, res) {

	req.session.username = "";
	req.session.logged = false;
	res.redirect("/");

}

function profile(req, res) {

	console.log("COUCOU")

	if (req.session.logged)
		res.render(__dirname + '/view/connected.html');
	else
		res.redirect('/accueil');

}




module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
module.exports.profile = profile;