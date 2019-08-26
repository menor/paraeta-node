const express = require('express')

const router = express.Router()

router.route('/healthz').get((req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: "I'm alive!"
    }
  })
})

module.exports = router
