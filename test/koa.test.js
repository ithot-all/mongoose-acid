const Acid = require('../src/acid')
const request = require('request-promise')
const Koa = require('koa')
const app = new Koa()

app.use(Acid.middleware())
app.use(async (ctx) => {
    ctx.status = 200
    ctx.body = {
        exist: ctx.acid !== null,
        type: typeof ctx.acid
    }
})

let server

beforeAll((done) => {
    server = app.listen(3333, (err) => {
        if (!err) {
            console.log('listen in 3333')
        }
        done()
    })
})
afterAll((done) => {
    server.close((err) => {
        if (!err) {
            console.log('server closed')
        }
        done()
    })
})

test('koa middleware', async () => {
    let data = await request({
        uri: 'http://localhost:3333',
        json: true
    })
    expect(data).toEqual({
        exist: true,
        type: 'function'
    })
})
