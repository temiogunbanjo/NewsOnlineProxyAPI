const express = require('express');
const ApiRepo = require('../ApiRepo');
const Validator = require('../middlewares/validatorMiddleWare');
// import authmid = require('../middlewares/authMid';

const router = express.Router();

const repo = new ApiRepo();

router.post(
  '/news',
  Validator.selectValidation('url'),
  Validator.validateRequest,
  repo.proxyNewsApi
);

module.exports = router;
