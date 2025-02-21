const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const { statusCode = 500, message = "Internal Server Error" } = err;
  res.status(statusCode).json({ message });
};

module.exports = errorHandler;
