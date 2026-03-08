const express = require('express');
const auth = require('../middlewares/auth.middleware');
const {applyForCouncil,getMyApplication} = require('../controllers/application.controller');

const router = express.Router();

router.post('/apply',auth,applyForCouncil);
router.get('/my',auth,getMyApplication);

module.exports = router;