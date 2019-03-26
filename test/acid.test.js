const mongoose = require('mongoose')
const os = require('os')
const hostname = os.hostname()
mongoose.set('debug', false)
const Acid = require('../src/acid')
const uri = os.platform() === 'win32' ? `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/test` : 'mongodb://localhost:27017,localhost:27018,localhost:27019/test'
let conn
const Account = mongoose.model('Account', new mongoose.Schema({
    balance: Number
}))
const People = mongoose.model('People', new mongoose.Schema({
    name: String,
    balance: Number
}))
beforeAll(async () => {
    conn = await mongoose.connect(uri, {
        replicaSet: 'rs',
        useNewUrlParser: true
    })
    await Account.deleteMany()
    await People.deleteMany()
    await Account.create({ balance: 100 })
    await People.create({ name: 'Acid', balance: 0 })
})
afterAll(async () => {
    await Account.deleteMany()
    await People.deleteMany()
    await conn.disconnect()
})
test('transaction normal', async () => {
    try {
        await Acid(async (session) => {
            await People.findOneAndUpdate(
                { name: 'Acid' },
                { $inc: { balance: 30 } },
                { new: true, session })
            await Account.findOneAndUpdate(
                {},
                { $inc: { balance: -30 } },
                { new: true, session })
        })
    } catch (error) { }
    let people = await People.findOne()
    let account = await Account.findOne()
    expect(people.balance).toEqual(0 + 30)
    expect(account.balance).toEqual(100 - 30)
})

test('transaction abnormal', async () => {
    try {
        await Acid(async (session) => {
            await People.findOneAndUpdate(
                { name: 'Acid' },
                { $inc: { balance: 30 } },
                { new: true, session })
            await Account.findOneAndUpdate(
                {},
                { $inc: { balance: -30 } },
                { new: true, session })
            throw new Error('User Error')
        })
    } catch (error) {

    }
    let people = await People.findOne()
    let account = await Account.findOne()
    expect(people.balance).toEqual(0 + 30)
    expect(account.balance).toEqual(100 - 30)
})
