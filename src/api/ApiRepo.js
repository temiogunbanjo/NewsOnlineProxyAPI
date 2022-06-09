/* eslint-disable valid-jsdoc */
/* eslint-disable class-methods-use-this */

/**
@module ApiRepo
* */
const HttpStatusCode = require("../ErrorHelpers/Statuscode");
const HelperUtils = require("../utils/HelperUtils");
const { sendSuccessResponse, sendErrorResponse } = require("../utils/sendResponses");

const ph = require("../utils/hash").default;

/**
@class
* */
class ApiRepo {
  /**
   *
   * @method
   * @param {Request} req
   * @param {Response} res
   * @param {const('express').NextFunction} next
   * @returns Response
   */
  async proxyNewsApi(req, res, next) {
    try {
      const { url } = req.body;
      let { options = {} } = req.body;

      const {
        headers = {},
        ...rest
      } = options;

      options = {
        method: 'GET',
        headers: {
          'content-type': req.headers['content-type'],
          // 'cache-control': req.headers['cache-control'],
          // 'accept-encoding': req.headers['accept-encoding'],
          'x-api-key': req.headers['x-api-key'],
          // accept: req.headers.accept,
          ...headers
        },
        ...rest
      };

      const response = await HelperUtils.fetchUrl(url, options);
      // console.log(response);

      if (!response?.data) {
        return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER, "An error occured");
      }

      return sendSuccessResponse(res, HttpStatusCode.OK, {
        message: "Fetched Successfully",
        data: response.data,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = ApiRepo;
