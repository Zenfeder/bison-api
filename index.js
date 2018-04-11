// Alias module path
const moduleAlias = require('module-alias')

moduleAlias.addAliases({
    '@root'  : __dirname,
    "@route": __dirname + "/src/route",
    "@controller": __dirname + "/src/controller",
    "@model": __dirname + "/src/model",
    "@utils": __dirname + "/src/utils"
})

moduleAlias()
 
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const route = require('@route/entry.js')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const port = process.env.PORT || 8081

route(app)

app.listen(port)
console.log(`服务已启动，端口： ${port}`)