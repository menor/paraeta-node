function createError(message = 'Internal server error', statusCode = 500) {
  const err = new Error(message);
  err.statusCode = statusCode;
  err.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
  err.isOperational = true;

  return err;
}

module.exports = createError;
