const shelljs = require('shelljs')

let fetch_details_of_all_instances = async (req, res, next) => {
    shelljs.exec('./middleware/instances.sh')
    next();
}

exports.fetch_details_of_all_instances = fetch_details_of_all_instances