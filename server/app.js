const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')

const app = express()

if (process.env.NODE_ENV === 'development') {
  // Simple development logger
  // TODO: Use pino for production
  app.use(morgan('dev'))
}

// SECURITY MIDDLEWARE

// Set security HTTP headers (this goes first)
app.use(helmet())

module.exports = app
