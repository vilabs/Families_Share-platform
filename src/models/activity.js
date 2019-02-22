const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
	activity_id: {
		type: String,
		unique: true
	},
	group_id: String,
	name: String,
	group_name: String,
	description: String,
	color: String,
	creator_id: String,
	repetition: Boolean,
	repetition_type: String,
	different_timeslots: Boolean,
},{timestamps: true,toJSON: { virtuals: true }})

activitySchema.virtual('dates', {
	ref: 'Day',
	localField: 'activity_id',
	foreignField: 'activity_id',
	justOne: false,
});


mongoose.pluralize(null);
const model = mongoose.model('Activity',activitySchema);


module.exports = model