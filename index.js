const mongoose = require('mongoose');

class ACID {

    constructor() {
        this._transactions = [];
        this._results = [];
        this._err;
    }

    static make() {
        return new ACID();
    }

    error(err) {
        this._err = err;
        return this;
    }

    add(transaction) {
        this._transactions.push(transaction);
        return this;
    }

    results() {
        return this._results;
    }

    async exec() {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            for (let i = 0; i < this._transactions.length; i++) {
                let transaction = this._transactions[i];
                // is a mongoose query
                if (mongoose.Query == transaction.constructor) {
                    transaction.options.session = session;
                    let result = await transaction;
                    this._results.push(result);
                }
                // is a pre function
                else {
                    let preTransaction = transaction(this._results[i - 1]);
                    if (preTransaction && mongoose.Query == preTransaction.constructor) {
                        preTransaction.options.session = session;
                        let result = await preTransaction;
                        this._results.push(result);
                    }
                }
            }
            await session.commitTransaction();
            session.endSession();
        } catch (err) {
            await session.abortTransaction();
            session.endSession();
            if (this._err) {
                this._err(err);
            } else {
                throw err;
            }
        }
    }
}

module.exports = ACID;