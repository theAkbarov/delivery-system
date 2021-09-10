const asyncWrapper = (requestHandler) => {
  return function (req, res, next) {
    return requestHandler(req, res, next).catch(next);
  };
};

const errorHandler = (error, req, res, next) => {
  res.status(500).json({ message: error.message });
};

module.exports = {
    asyncWrapper,
    errorHandler
}