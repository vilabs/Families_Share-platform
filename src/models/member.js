const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
    user_id:String, 
    group_id: String,
    admin: Boolean,
    group_accepted: Boolean,
    user_accepted: Boolean,
		acl_rule_id: String,
},{timestamps: true});

memberSchema.index({ group_id: 1, user_id: 1}); 

mongoose.pluralize(null);
const model = mongoose.model('Member', memberSchema);

module.exports = model ;