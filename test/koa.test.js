const mongoose = require('mongoose')
const Acid = require('../src/acid')
const os = require('os')
const PORT = 3333
const hostname = os.hostname()

mongoose.set('debug', false)
Acid.set('debug', false)

const uri = os.platform() === 'win32' ? `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/test` : 'mongodb://localhost:27017,localhost:27018,localhost:27019/test'

const request = require('request-promise')
const Koa = require('koa')
const app = new Koa()

const Middleware = mongoose.model('Middleware', new mongoose.Schema({
    name: String,
    key: Number
}))

app.use(Acid.middleware())
app.use(async (ctx) => {
    await ctx.acid(async function (session) {
        await Middleware.findOneAndUpdate({ name: 'koa' }, { name: 'koa_modify' }, { session })
        await Middleware.create([{ name: 'koa', key: 1 }], { session })
        this.body = {
            flag: 'acid'
        }
    })
    let middleware0 = await Middleware.findOne({ key: 0 })
    let middleware1 = await Middleware.findOne({ key: 1 })
    ctx.body = Object.assign(ctx.body, { m0: middleware0.name, m1: middleware1.name })
})

let server
let conn

test('koa middleware', async () => {
    let response = await request({
        uri: `http://localhost:${PORT}`,
        json: true
    })
    expect(response).toEqual({
        flag: 'acid',
        m0: 'koa_modify',
        m1: 'koa'
    })
})

beforeAll(async () => {
    conn = await mongoose.connect(uri, {
        replicaSet: 'rs',
        useNewUrlParser: true
    })
    await Middleware.create({ name: 'koa', key: 0 })
    server = await new Promise((resolve, reject) => {
        let s = app.listen(PORT, (err) => {
            if (!err) {
                resolve(s)
            }
            reject(err)
        })
    })
})

afterAll(async () => {
    await Middleware.deleteMany({ name: 'koa' })
    await conn.disconnect()
    await new Promise((resolve, reject) => {
        server.close((err) => {
            if (!err) {
                resolve()
            }
            reject(err)
        })
    })
})