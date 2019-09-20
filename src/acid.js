const mongoose = require('mongoose')

async function Acid (wrapper, ctx) {
    let session = await mongoose.startSession()
    let value = null
    logger('Transaction started')
    if (ctx !== null) {
      await session.withTransaction(async () => {
        value = await wrapper.call(ctx, session)
      })
    } else {
      await session.withTransaction(async () => {
        value = await wrapper(session)
      })
    }
  logger('Transaction End')
  return value
}

Acid.middleware = function () {
  return async function (ctx, next) {
    ctx.acid = async function (wrapper, _ctx) {
      let value = await Acid(wrapper, _ctx || ctx)
      return value
    }
    await next()
  }
}

module.exports = Acid

Acid.debug = false

Acid.set = function (key = 'debug', value) {
    Acid[key] = value
}

function logger (val) {
    if (!Acid.debug) return
    console.log('[acid]', val)
}