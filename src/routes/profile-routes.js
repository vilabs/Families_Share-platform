const express = require('express');
const router = new express.Router();

const Profile = require('../models/profile');

router.get('/', (req, res)=>{
    if (!req.user_id) return res.status(401).send('Not authenticated')
    const searchBy = req.query.searchBy;
    switch (searchBy){
        case "ids": 
            const ids = req.query.ids;
            Profile.find({ user_id : { $in: ids } })
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
            break;
        case "visibility": 
            const visible = req.query.visible
            Profile.find({ visible: visible })
						.populate('image', 'path')
						.sort({ given_name: 1, family_name: 1})
            .lean().exec( (error, profiles) =>{
                if (error){
                    res.status(400).send("Something went wrong");
                }
                if(profiles.length>0){
                    res.json(profiles);
                } else {
                    res.status(404).send("No visible profiles found")
                }
            });
            break;
    }
});



module.exports = router;