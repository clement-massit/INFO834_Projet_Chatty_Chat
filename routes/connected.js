let router = require('express').Router();
let controller = require("../controllers");


router.get('/connected', function(req, res) {
    controller.test(req,res);
});

router.get('/connected', function(req, res) {
	controller.message(req, res);

});

module.exports = router;