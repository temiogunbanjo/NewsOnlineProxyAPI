/* eslint-disable no-console */
/* eslint-disable valid-jsdoc */
/**
 *
 * Description. (This module handles token validation globaly in the app)
 */

 const TokenProcessor = require('../../utils/tokenProcessor');
 const SendResponses = require('../../utils/sendResponses');
 const StatusCodes = require('../../ErrorHelpers/Statuscode');
 const dbValidator = require('../../core/data/dbValidator');
 
 const { verifyToken, createToken } = TokenProcessor;
 const { sendErrorResponse } = SendResponses;
 /**
  * @param {Request} req
  * @param {Response} next
  * @param {import('express').NextFunction} res
  * @returns Response
  */
 
 module.exports = async (req, res, next) => {
   try {
     // console.log(req.headers['x-mobile-authorization']);
     if (!req.headers.authorization && !req.headers['x-mobile-authorization']) {
       return sendErrorResponse(res, 401, 'Authentication required');
     }
     const token = (!req.headers.authorization
       ? null : req.headers.authorization.split(' ')[1]
     )
     || (!req.headers['x-mobile-authorization']
       ? null : createToken(
         { ...(await dbValidator.fetchUserWithPhone(req.headers['x-mobile-authorization'])) }
         || { phone: req.headers['x-mobile-authorization'] }
       )
     )
     || (!req.headers.cookie
       ? null : req.headers.cookie.split('=')[1]
     );
 
     if (!token) {
       return res
         .status(StatusCodes.UNAUTHORIZED)
         .send({ message: 'Access Denied' });
     }
     const payload = verifyToken(token);
     // console.log(payload);
 
     if (!payload) return sendErrorResponse(res, StatusCodes.UNAUTHORIZED, 'Access Denied');
     if (
       !payload.userId
       && !payload.agentId
       && !payload.adminId
     ) {
       return sendErrorResponse(res,
         StatusCodes.NOT_FOUND,
         'User Id not found in token');
     }
     req.user = payload;
     req.token = token;
     next();
   } catch (err) {
     console.log(err.message);
     if (err.name && err.name === 'TokenExpiredError') {
       return sendErrorResponse(res, StatusCodes.UNAUTHORIZED, 'Token expired');
     }
     const error = err.message ? 'Authentication Failed' : err;
     next(error);
   }
 };
 