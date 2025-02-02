const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    socialLinks: {
        linkedin: { type: String, default: '' },
        twitter: { type: String, default: '' },
        facebook: { type: String, default: '' }
    }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
