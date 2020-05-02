const Data = require('../models/data')

const SaveData = async (cpu_usage, memory_usage) => {
    console.log(`INSIDE SAVE DATA MONGO FUNCTION`)
    console.log(cpu_usage, memory_usage)
    let data = new Data({cpu_usage, memory_usage})
    return await data.save()
}

exports.SaveData = SaveData