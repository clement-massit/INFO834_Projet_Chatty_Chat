


function getUsername(req, res) {

	let User = require("../models/utilisateur");

    User.findById({username : req.body.username})
    .then((user) => {
        res.status(200).json(user);
    }, (err) => {
        res.status(500).json(err);
    });

}




module.exports.getUsername = getUsername;
