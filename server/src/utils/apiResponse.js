const statusCodes = require("./statusCodes");

const ApiSuccess = (
  res,
  data = {},
  message = "OK",
  statusCode = statusCodes.HTTP_200_SUCCESS
) => {
  const jsonObj = {
    status: "OK",
    message,
  };

  if (data != {}) jsonObj["data"] = data;

  return res.status(statusCode).json(jsonObj);
};

const ApiError = (res, message, statusCode) => {
  return res.status(statusCode).json({
    status: `${statusCode}`.startsWith(4) ? "FAIL" : "ERROR",
    message: message,
    statusCode: statusCode,
  });
};

const Validation = (res, errors) => {
  return res.status().json({
    status: "ERROR",
    errors: errors,
  });
};

module.exports = {
  ApiSuccess,
  ApiError,
  Validation,
};
