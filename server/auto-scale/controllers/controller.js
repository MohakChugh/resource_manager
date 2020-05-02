const save_function = require('../database/functions/save_data')
const get_function = require('../database/functions/get_data')

let get_data = async (req, res) => {
    let {cpu_usage, percentage_memory_available} = req.body
    console.log(`INSIDE GET DATA` + cpu_usage, percentage_memory_available)
    let result = await save_function.SaveData(cpu_usage, percentage_memory_available)
    res.json({error: false, success: true, response: result})
}

let show_data = async (req, res) => {
    console.log('INSIDE SHOW DATA')
    let data = await get_function.GetData()
    res.json({error: false, success: true, response: data})
}

exports.get_data = get_data
exports.show_data = show_data