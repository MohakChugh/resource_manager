const shell = require('shelljs')

const save_function = require('../database/functions/save_data')
const get_function = require('../database/functions/get_data')

let get_data = async (req, res) => {
    let { cpu_usage, percentage_memory_available } = req.body
    if (cpu_usage > 70 || percentage_memory_available > 70) shell.exec('../kubernetes/create-cluster.sh ../kubernetes/mohak-k8s-test.pem ')
    if (cpu_usage < 10 || percentage_memory_available < 10) shell.exec('../kubernetes/delete-cluster.sh ../kubernetes/mohak-k8s-test.pem ')
    let result = await save_function.SaveData(cpu_usage, percentage_memory_available)
    res.json({ error: false, success: true, response: result })
}

let show_data = async (req, res) => {
    console.log('INSIDE SHOW DATA')
    let data = await get_function.GetData()
    res.json({ error: false, success: true, response: data })
}

let get_instances = async (req, res) => {
    let south = require('../middleware/south.json')
    let southeast = require('../middleware/southeast.json')
    let instances = south.instances.concat(southeast.instances)
    setTimeout(() => {
        shell.exec('rm -f ./middleware/south.json')
        shell.exec('rm -f ./middleware/southeast.json')
    }, 3000);
    res.json({error: false, success: true, instances})
}

exports.get_data = get_data
exports.show_data = show_data
exports.get_instances = get_instances