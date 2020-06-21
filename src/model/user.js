const { model, Schema } = require('mongoose');

exports.User = model('User', Schema({
    name: { type: String, required: true },
    password: { type: String, required: true }
}))
