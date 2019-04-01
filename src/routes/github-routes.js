const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;


router.post('/pushevent', (req, res, next) => {
	exec('git pull origin master', (err, stdout, stderr) => {
		if (err) {
			console.log(`stderr:  ${stderr}`);
			next(err)
		}
	console.log(`stdout: ${stdout}`);
	console.log(req)
	res.sendStatus(200)
	})
})

module.exports = router
