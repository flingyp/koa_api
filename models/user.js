const mongoose = require('mongoose')


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    }, 
    password: {
        type: String,
        required: true,
        select: false
    },
    mobile: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('user', userSchema)