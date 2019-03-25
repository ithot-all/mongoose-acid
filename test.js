const assert = require('assert');
const mongoose = require('mongoose')

// console.log(mongoose.Document.prototype);
const Account = mongoose.model('Account', new mongoose.Schema({
    name: String, balance: Number
}));

const start = async function () {
    const uri = 'mongodb://localhost/ithot'

    const conn = await mongoose.connect(uri, {
        useNewUrlParser: true
    })

    // let a = await Account.create({name: 1})
    // console.log(a.save);
    // console.log(a.remove);

    // console.log(mongoose.Model.prototype.save);
    // console.log(mongoose.Model.prototype.remove);

    // console.log(a.save === mongoose.Model.prototype.save);
    // console.log(a.remove === mongoose.Model.prototype.remove);

    let a = await Account.findOne({ name: '1' })
    console.log('save', a.save);
    // console.log('remove', a.remove);

    console.log('save', mongoose.Model.prototype.save);
    // console.log('remove', mongoose.Model.prototype.remove);

    console.log(a.save === mongoose.Model.prototype.save);
    console.log(a.remove === mongoose.Model.prototype.remove);
    await conn.disconnect()
}

start()