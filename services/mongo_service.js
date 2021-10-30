const mongoose = require('mongoose');
class Database {
  constructor() {
    this._connect()
  }

_connect() {
     mongoose.connect(`mongodb://localhost:27017/mindspark`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(() => {
         console.log('Database connection successful')
       })
       .catch((err) => {
         console.error('Database connection error')
         console.error(err)
       })
  }
}

module.exports = new Database()