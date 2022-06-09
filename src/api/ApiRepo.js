/* eslint-disable valid-jsdoc */
/* eslint-disable class-methods-use-this */

/**
@module ApiRepo
* */
import HttpStatusCode from "../ErrorHelpers/Statuscode";
import HelperUtils from "../utils/HelperUtils";
import User from "../core/domain/UserModel";
import { sendSuccessResponse, sendErrorResponse } from "../utils/sendResponses";
import axios from "axios";

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
   * @param {import('express').NextFunction} next
   * @returns Response
   */
  async proxyNewsApi(req, res, next) {
    try {
      const { url } = req.body;
      let { options = {} } = req.body;

      const { headers = {}, ...rest } = options;
      options = {
        headers: {
          ...req.headers,
          ...headers
        },
        ...rest
      };

      const response = await HelperUtils.fetchUrl(url, options);

      if (!response) {
        return sendErrorResponse(res, HttpStatusCode.INTERNAL_SERVER, "An error occured");
      }

      return sendSuccessResponse(res, HttpStatusCode.CREATED, {
        message: "Fetched Successfully",
        data: response,
      });
    } catch (error) {
      return next(error);
    }
  }
}

export default ApiRepo;
