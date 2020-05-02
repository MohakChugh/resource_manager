const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const cors = require('cors')

const {connectDB} = require('./database/configuration/connect')
const routes = require('./routes/routes')

const app = express()
connectDB()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

app.use('/', routes)

module.exports = app
