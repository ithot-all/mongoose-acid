const Acid = require('../src/acid')

const Koa = require('koa')
const app = new Koa()

app.use(Acid.middleware())

