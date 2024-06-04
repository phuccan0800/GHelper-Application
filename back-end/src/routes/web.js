const express = require('express');
const { GetHomePage, GetTTP } = require('../controllers/HomeController');
const router = express.Router();

router.get('/', GetHomePage);
router.get('/GetTTP', GetTTP);

module.exports = router;