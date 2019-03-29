const express = require('express')
const router = new express.Router()


router.post('/pushevent', (req, res, next) => {
  res.sendStatus(200)
})

module.exports = router
