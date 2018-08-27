# mongoose-acid
:sunglasses: a api friendly mongoose transaction tool 

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
- ### simple
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
})();
```