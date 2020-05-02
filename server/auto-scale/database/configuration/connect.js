const mongoose = require('mongoose')

const connectDB = async () => {
    await mongoose.connect('mongodb://localhost/my_database', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => {
            console.log(`Mongo Db Connected`)
        })
        .catch(err => {
            console.log(`Error in connecting to mongodb. ${err}`)
        });
}
exports.connectDB = connectDB