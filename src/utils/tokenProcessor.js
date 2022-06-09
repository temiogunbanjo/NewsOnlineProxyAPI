const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  verifyToken: (token) => jwt.verify(token, `${process.env.JWT_SECRET}`, {
    expiresIn: '1d',
    algorithms: [
      'HS256'
    ]
  }),
  createToken: (payload) => jwt.sign(payload, `${process.env.JWT_SECRET}`, {
    expiresIn: '1d'
  })
};
