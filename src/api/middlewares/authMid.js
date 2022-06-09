/* eslint-disable valid-jsdoc */
/**
 *
 * Description. (This module handles token validation globaly in the app)
 */

import { verifyToken } from '../../utils/tokenProcessor';
import { sendErrorResponse } from '../../utils/sendResponses';

/**
 * @param {Request} req
 * @param {Response} next
 * @param {import('express').NextFunction} res
 * @returns Response
 */

export default async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendErrorResponse(res,
        401, 'Authentication required');
    }
    const token = req.headers.authorization.split(' ')[1]
    || req.headers.authorization || req.headers.cookie.split('=')[1];

    if (!token) return res.status(401).send({ message: 'Access Denied' });
    const payload = verifyToken(token);
    console.log(payload);

    if (!payload) return sendErrorResponse(res, 401, 'Access Denied');
    req.user = payload;
    req.token = token;
    next();
  } catch (err) {
    // console.log(err.name, Object.keys(err));
    if (err.name && err.name === 'TokenExpiredError') return sendErrorResponse(res, 401, 'Token expired');
    const error = err.message ? 'Authentication Failed'
      : err;
    next(error);
  }
};
