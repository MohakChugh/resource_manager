const mongoose = require('mongoose')
const Data = new mongoose.Schema({
    id: {
        type: mongoose.Types.ObjectId
    },
    cpu: {
        type: Number
    },
    memory: {
        type: Number,
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Data", Data);
