const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;

router.post('/pushevent', (req, res, next) => {
	exec('sh sync.sh', (err, stdout, stderr) => {
	});
	res.sendStatus(200)
})

module.exports = router
