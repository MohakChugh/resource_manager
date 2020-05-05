const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')
const middleware = require('../middleware/middleware')

router.route('/', )
  .post(controller.get_data)
  .get(controller.show_data)

router.get('/instances', middleware.fetch_details_of_all_instances, controller.get_instances)

module.exports = router;
