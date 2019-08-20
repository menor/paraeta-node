const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const app = express()
const globalErrorHandler = require('./middleware/errorHandler')

if (process.env.NODE_ENV === 'development') {
  // Simple development logger
  // TODO: Use pino for production
  app.use(morgan('dev'))
}

// SECURITY MIDDLEWARE

// Set security HTTP headers (this goes first)
app.use(helmet())

// Limit requests from the same IP
const limiter = rateLimit({
  // We are going to allow 100 requests per hour
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.'
})

app.use(limiter)

// Body parser, reading data from the body into req.body
// also limiting the amount of data the req can contain
app.use(express.json({ limit: '10kb' }))

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(
  hpp({
    // whitelist parameters that we allow to be duplicated in queries
    // this could be better by getting it directly from the model
    whitelist: []
  })
)

app.use(globalErrorHandler)

module.exports = app
