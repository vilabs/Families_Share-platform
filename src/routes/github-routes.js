const express = require('express')
const router = new express.Router()
const exec = require('child_process').exec;


router.post('/pushevent', async (req, res, next) => {
	await exec('cd ../../ | git pull origin master', (err, stdout, stderr) => {

		if (err) {
			console.log(`stderr:  ${stderr}`);
		}

	console.log(`stdout: ${stdout}`);
	res.sendStatus(200)
	
	})
})

module.exports = router
