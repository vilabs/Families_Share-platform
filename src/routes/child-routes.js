const express = require('express');
const router = new express.Router();

const Child = require('../models/child');

router.get('/', (req, res)=>{
    if (!req.user_id) return res.status(401).send('Not authenticated')
    const ids = req.query.ids;
    Child.find({ child_id : { $in: ids } })
    .populate('image', 'path')
    .lean().exec ( (error, profiles) =>{
        if (error){
            res.status(400).send("Something went wrong");
        }
        if(profiles.length>0){
            res.json(profiles);
        } else {
            res.status(404).send("Profiles not found")
        }
    });
});



module.exports = router;