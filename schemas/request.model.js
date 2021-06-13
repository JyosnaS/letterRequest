const mongoose = require("mongoose")

const requestModel = new mongoose.Schema({
    fullname: String,
    email: String,
    type: String,
    requestedDate: Date,
    status: {
        type: Boolean,
        defaultValue: false
    }
});


module.exports = mongoose.model('request_model', requestModel);