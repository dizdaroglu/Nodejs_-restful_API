global.router = require('express').Router();
var router = global.router;

router = require('./food');
router = require('./category');
router = require('./movie');

/* GET home page. */
router.get('/', (request, response, next) => {
    response.render('index', { title: 'My tutorial videos' });
});



module.exports = router;