import express from 'express';
import ApiRepo from '../ApiRepo';
import Validator from '../middlewares/validatorMiddleWare';
// import authmid from '../middlewares/authMid';

const router = express.Router();

const repo = new ApiRepo();

router.post(
  '/news',
  Validator.selectValidation('url'),
  Validator.validateRequest,
  repo.proxyNewsApi
);

export default router;
