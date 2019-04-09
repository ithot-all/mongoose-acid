const mongoose = require('mongoose')
const debug = require('debug')('acid')

async function Acid (wrapper) {
    const session = await mongoose.startSession()
    session.startTransaction()
    debug('transaction start')
    try {
        await wrapper(session)
        await session.commitTransaction()
        debug('transaction successful')
    } catch (err) {
        debug('transaction failure')
        await session.abortTransaction()
        throw err
    } finally {
        debug('transaction end')
        session.endSession()
    }
}

Acid.middleware = () => {
    return async (ctx, next) => {
        ctx.acid = Acid
        await next()
    }
}

module.exports = Acid