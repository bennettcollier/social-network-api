const router = require('express').Router();
const apiRoutes = require('./api');


// prefix api on api routes
router.use('/api', apiRoutes);

module.exports = router;
