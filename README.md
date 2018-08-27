![android-sex-http](art/logo.png)

# mongoose-acid
:sunglasses: a api friendly mongoose transaction tool **(you don't need to set the session option, I've injected it for you)**

# install 
```
npm install mongoose-acid --save
```

# required

> nodejs >= 7.6 | mongoose >= 5.2 | mongodb >= 4.0

# usage
```javascript
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27111,localhost:27112,localhost:27113/test';
const Account = mongoose.model('Account', new mongoose.Schema({
    name: String, balance: Number
}));
```
### ● simple
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add(Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: -5 } }))
        .exec();
    await conn.disconnect();
})();
```

### ● gets the value of the previous operation
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add((a) => {
            return Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: a.balance } })
        })
        .exec();
    await conn.disconnect();
})();
```

### ● error handling (one)
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    try{
         await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add((a) => {
            throw new Error();
            return Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: a.balance } })
        })
        .exec()
    } catch(err) {

    }
     await conn.disconnect();
})();
```

### ● error handling (two)
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add((a) => {
            throw new Error();
            return Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: a.balance } })
        })
        .error((err) => {

        })
        .exec();
     await conn.disconnect();
})();
```

### ● not when mongoose query
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add(Account.findOneAndUpdate({ name: 'B' }, { $inc: { balance: -5 } }))
        .add((b, all) => {
            let a = all[0];
            let b = all[1];
        })
        .exec();
     await conn.disconnect();
})();
```

### ● Model.create (because `Model.create` returns a Promise, there's no way to inject it)
```javascript
const ACID = require('mongoose-acid');

(async () => {
    const conn = await mongoose.connect(uri, {
        replicaSet: 'app',
        useNewUrlParser: true
    });
    await ACID.make()
        .add(Account.findOneAndUpdate({ name: 'A' }, { $inc: { balance: +5 } }))
        .add((a, all, session) => {
            return Account.create([{ name: 'C', balance: 5 }, { name: 'D', balance: 10 }], { session });
        })
        .exec();
     await conn.disconnect();
})();
```

# contribute
> welcome to improve the library [issue](https://github.com/dtboy1995/mongoose-acid/issues)