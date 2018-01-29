const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const route = require('./src/route');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 8081;

route(app);

app.listen(port);
console.log(`服务已启动，端口： ${port}`);