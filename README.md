![mongoose-acid](art/logo.png)

[![Build Status](https://img.shields.io/travis/ithot-all/mongoose-acid/master.svg?style=flat-square)](https://travis-ci.org/ithot-all/mongoose-acid)

[![NPM](https://nodei.co/npm/mongoose-acid.png?compact=true)](https://npmjs.org/package/mongoose-acid)


# mongoose-acid
:sunglasses: mongoose transaction helper

### install 
```
npm i mongoose-acid -S
``` 

### required

```
nodejs >= 7.6 | mongoose >= 5.2 | mongodb >= 4.0
```

### usage

```javascript
const Acid = require('mongoose-acid')
try {
  await Acid( async (session) => {
    await People.findOneAndUpdate({ name: 'Acid' },{ $inc: { balance: 30 } },{ session })
    await Account.findOneAndUpdate({ name: 'Blank'},{ $inc: { balance: -30 } },{ session })
    // ... 
  })
} catch (err){

}
```

### test

```
npm test
```
