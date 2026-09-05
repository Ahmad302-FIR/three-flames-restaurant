import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const errorDetails = errors.array().map((err) => ({
      field: err.path,
      message: err.msg
    }));

    return sendError(res, 400, 'Invalid request input. Please check provided fields.', errorDetails);
  };
};
