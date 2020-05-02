const Data = require('../models/data')

const GetData = async () => {
    let data = await Data.find().sort({timestamp: -1}).limit(20)
    console.log(`INSIDE GET DATA MONGO FUNCTION`)
    console.log(data)
    remove_all_before_latest()
    return await data
}

const remove_all_before_latest = async () => {
    let data = await Data.find().sort({timestamp: -1}).skip(20)
    data.forEach(ele => {
        console.log(`Deleting element with id ${ele._id}`)
        Data.findByIdAndRemove(ele._id)
        console.log()
    })
    return data
}

exports.GetData = GetData