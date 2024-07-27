/* 
  This middleware is used to validate the request body against the schema provided.
*/

const { Validation } = require("../utils/apiResponse");

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      let errors = [];

      error["details"].forEach((err) => {
        errors.push(err["message"]);
      });

      return Validation(res, errors);
    } else next();
  };
};

module.exports = validateRequest;
