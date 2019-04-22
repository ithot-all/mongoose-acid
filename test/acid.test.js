const mongoose = require('mongoose')
const Acid = require('../src/acid')
const os = require('os')
const hostname = os.hostname()

mongoose.set('debug', false)
Acid.set('debug', false)

const uri = os.platform() === 'win32' ? `mongodb://${hostname}:27017,${hostname}:27018,${hostname}:27019/test` : 'mongodb://localhost:27017,localhost:27018,localhost:27019/test'
let conn

const Account = mongoose.model('Account', new mongoose.Schema({
    balance: Number
}))
const People = mongoose.model('People', new mongoose.Schema({
    name: String,
    balance: Number
}))
const Foo = mongoose.model('Foo', new mongoose.Schema({
    name: String
}))

beforeAll(async () => {
    conn = await mongoose.connect(uri, {
        replicaSet: 'rs',
        useNewUrlParser: true
    })
    await Foo.createCollection()
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

test('transaction with context', async () => {
    let ctx = {
        name: 'context'
    }
    try {
        await Acid(async function (session) {
            await Foo.create([{ name: 'foo' }], { session })
            expect(this === ctx).toBeTruthy()
        }, ctx)
    } catch (error) {
        throw error
    }
})

test('transaction without context', async () => {
    let that = this
    try {
        await Acid(async (session) => {
            await Foo.create([{ name: 'foo' }], { session })
            expect(this === that).toBeTruthy()
        })
    } catch (error) {
        throw error
    }
})

test('transaction without context (pure function)', async () => {
    try {
        await Acid(async function (session) {
            await Foo.create([{ name: 'foo' }], { session })
            expect(this === global).toBeTruthy()
        })
    } catch (error) {
        throw error
    }
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
