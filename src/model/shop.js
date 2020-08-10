const {model, Schema} = require('mongoose');

exports = model('Shop', Schema({
    code: String,
    desc: String,
    name: String
}))
