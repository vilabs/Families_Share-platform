const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;


router.post('/pushevent', (req, res, next) => {
	exec('cd ../../ | git pull origin master');
	console.log('Pulled updated master');
  res.sendStatus(200)
})

module.exports = router
