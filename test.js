const assert = require('assert');
const mongoose = require('mongoose')
const uri = 'mongodb://localhost:27111,localhost:27112,localhost:27113/ithot'

const Account = mongoose.model('Account', new mongoose.Schema({
    name: String, balance: Number
}));

const ACID = require('./');

const TEST_CASES = {
    init: async () => {
        await Account.create([{ name: 'A', balance: 5 }, { name: 'B', balance: 10 }]);
        console.log('accounts ready');
    },
    simple: async () => {
        const conn = await mongoose.connect(uri, {
            replicaSet: 'app',
            useNewUrlParser: true
        });
        await ACID.make()
            .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }, { new: true }))
            .add(Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: -5 } }, { new: true }))
            .add((b, all) => {
                assert.equal(all[0].balance, 10);
            })
            .exec();

        await conn.disconnect();
        console.log('test pass');
    },
    error: async () => {
        const conn = await mongoose.connect(uri, {
            replicaSet: 'app',
            useNewUrlParser: true
        });
        await ACID.make()
            .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }, { new: true }))
            .add(() => {
                throw new Error();
                Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: -5 } }, { new: true })
            })
            .error((err) => {
                console.log('error happened, test pass');
            })
            .exec();

        await conn.disconnect();
    }
};


// TEST_CASES.init();
// TEST_CASES.simple();
TEST_CASES.error();