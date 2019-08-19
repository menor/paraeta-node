const createError = require('./../utils/createError')

// TODO: Make functions return a tuple (statusCode, payload) to avoid passing
// the request around
function handleError(err, req, res, next) {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    error.message = err.message

    if (error.name === 'CastError') error = handleCastErrorDB(error)
    if (error.code === 11000) error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error)

    sendErrorProd(error, res)
  }
}

function sendErrorDev(err, res) {
  return res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack
  })
}

function sendErrorProd(err, res) {
  // Operational, send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  }

  // Programming or other unknown error: don't leak error details
  console.error('💥 ERROR', err)
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  })
}

// DATABASE ERRORS

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path}: ${err.value}.`
  return createError(message, 400)
}

function handleDuplicateFieldsDB(err) {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0]

  const message = `Duplicate field value: ${value}. Please use another value!`
  return createError(message, 400)
}

function handleValidationErrorDB(err) {
  const errors = Object.values(err.errors).map(el => el.message)

  const message = `Invalid input data. ${errors.join('. ')}`
  return createError(message, 400)
}

module.exports = handleError
