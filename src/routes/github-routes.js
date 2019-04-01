const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;


router.post('/pushevent', (req, res, next) => {
	exec('git pull origin master', (err, stdout, stderr) => {
		console.log(req.body.payload.commits[0].message)
		exec('pm2 restart Families_Share', (err2, stdout2, stderr2) => {
			res.sendStatus(200)
		});
	})
})

module.exports = router
