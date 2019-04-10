const Acid = require('../src/acid')
const request = require('supertest')
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

test('koa middleware', (done) => {
    request(app.listen())
        .get('/')
        .expect(200, {
            exist: true,
            type: 'function'
        }, done)
})
