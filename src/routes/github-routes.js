const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;


router.post('/pushevent', (req, res, next) => {
	console.log(req)
	exec('git pull origin master', (err, stdout, stderr) => {
		if(err){
			next(err)
		}
		res.sendStatus(200)
		});
});

module.exports = router
