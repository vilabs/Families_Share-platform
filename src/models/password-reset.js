const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema({
    email: String,
    user_id: String,
    token: String,
}, {timestamps:true });

passwordResetSchema.index({createdAt: 1},{expireAfterSeconds: 60*60*24});


mongoose.pluralize(null);
const model = mongoose.model('Password_Reset',passwordResetSchema);

module.exports = model ;