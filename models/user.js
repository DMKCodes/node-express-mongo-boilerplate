const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        default: '',
        required: true
    },
    admin: {
        type: Boolean,
        default: false
    },
    refreshToken: String
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);