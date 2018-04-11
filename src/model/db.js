const config = require('@root/config.js')
const mongoose = require('mongoose')

mongoose.connect(config.dbpath)

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function() {
  console.log('mongodb connected...')
})

module.exports = mongoose