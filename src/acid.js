const mongoose          = require('mongoose')
const PromiseWrapper    = require('./promise-wrapper')
const AsyncFunction     = Object.getPrototypeOf(async function () { }).constructor
const debug             = require('debug')('acid')

class Acid {

    constructor() {
        this.transactions = []
        this.results = []
        this.err
    }

    static make () {
        return new Acid()
    }

    error (err) {
        this.err = err
        return this
    }

    add (transaction) {
        this.transactions.push(transaction)
        return this
    }

    results () {
        return this.results
    }

    async exec () {
        const session = await mongoose.startSession()
        session.startTransaction()
        debug('start a transaction')
        try {
            for (let i = 0; i < this.transactions.length; i++) {
                let transaction = this.transactions[i]
                /* mongoose-query */
                if (mongoose.Query === transaction.constructor) {
                    transaction.options.session = session
                    let result = await transaction
                    this.results.push(result)
                }
                /* promise-wrapper */
                else if (PromiseWrapper === transaction.constructor) {
                    transaction.inject(session)
                    let result = await transaction
                    this.results.push(result)
                }
                /* function async function */
                else if (Function === transaction.constructor || AsyncFunction === transaction.constructor) {
                    let preTransaction = await transaction(this.results[i - 1], this.results, session)
                    if (preTransaction) {
                        if (mongoose.Query === preTransaction.constructor) {
                            preTransaction.options.session = session
                            let result = await preTransaction
                            this.results.push(result)
                        } else if (PromiseWrapper === preTransaction.constructor) {
                            preTransaction.inject(session)
                            let result = await preTransaction
                            this.results.push(result)
                        } else {
                            this.results.push(null)
                        }
                    } else {
                        this.results.push(null)
                    }
                }
                /* invalid parameter type */
                else {
                    throw new Error(`invalid parameter type: [${transaction.constructor}]`)
                }
            }
            await session.commitTransaction()
            session.endSession()
            debug('transaction is successful')
        } catch (err) {
            debug('transaction is failure')
            await session.abortTransaction()
            session.endSession()
            if (this.err) {
                this.err(err)
            } else {
                throw err
            }
        }
    }
}

module.exports = Acid