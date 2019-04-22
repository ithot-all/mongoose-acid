const mongoose = require('mongoose')

async function Acid (wrapper, ctx) {
    const session = await mongoose.startSession()
    logger(session)
    session.startTransaction()
    logger('Transaction start')
    try {
        let value = await execute(wrapper, session, ctx)
        await commit(session)
        logger('Transaction commit')
        return value
    } catch (err) {
        logger('Transaction abort')
        await session.abortTransaction()
        throw err
    } finally {
        logger('Transaction end')
        session.endSession()
    }
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

async function execute (wrapper, session, ctx) {
    try {
        let value
        if (ctx !== null) {
            value = await wrapper.call(ctx, session)
        } else {
            value = await wrapper(session)
        }
        return value
    } catch (err) {
        if (err.errorLabels && err.errorLabels.indexOf('TransientTransactionError') >= 0) {
            logger('TransientTransactionError, retrying transaction ...')
            await execute(wrapper, session, ctx)
        } else {
            throw err
        }
    }
}

async function commit (session) {
    try {
        await session.commitTransaction()
    } catch (err) {
        if (err.errorLabels && err.errorLabels.indexOf('UnknownTransactionCommitResult') >= 0) {
            logger('UnknownTransactionCommitResult, retrying commit operation ...')
            await commit(session)
        } else {
            throw err
        }
    }
}

Acid.debug = false

Acid.set = function (key = 'debug', value) {
    Acid[key] = value
}

function logger (val) {
    if (!Acid.debug) return
    console.log('[acid]', val)
}