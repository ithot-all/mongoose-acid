![android-sex-http](art/logo.png)

# mongoose-acid
:sunglasses: 一个api友好的mongoose事务小工具 **(你不需要再设置session这个选项了，工具会帮你注入)**

# 安装
```
npm install mongoose-acid --save
```

# 必须的

> nodejs >= 7.6 | mongoose >= 5.2 | mongodb >= 4.0

# 用法
```javascript
const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27111,localhost:27112,localhost:27113/test';
const Account = mongoose.model('Account', new mongoose.Schema({
    name: String, balance: Number
}));
```
- ### 简单点
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

- ### 拿到前一个结果的返回值
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

- ### 错误处理 1
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

- ### 错误处理 2
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

- ### 如果给add方法传入的不是一个mongoose.Query
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

- ### 像`Model.create`这种方法直接返回promise，工具没有办法注入，所以请您手动注入
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

# 贡献
> 欢迎一起改进这个工具 [issue](https://github.com/dtboy1995/mongoose-acid/issues)