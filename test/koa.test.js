const Acid = require('../src/acid')
const request = require('supertest')
const Koa = require('koa')

test('koa middleware', (done) => {
    const app = new Koa()
    app.use(Acid.middleware())
    app.use((ctx) => {
        expect(typeof ctx.acid).toEqual('function')
        ctx.status = 200
    })
    request(app.listen()).get('/').expect(200, done)
})