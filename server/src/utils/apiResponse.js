const ApiSuccess = (res, data = {}, message = "OK", statusCode = 200) => {
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
  });
};

const Validation = (res, errors) => {
  return res.status(400).json({
    status: "ERROR",
    errors: errors,
  });
};

module.exports = {
  ApiSuccess,
  ApiError,
  Validation,
};
