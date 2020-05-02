const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller')

router.route('/')
  .post(controller.get_data)
  .get(controller.show_data)

module.exports = router;
