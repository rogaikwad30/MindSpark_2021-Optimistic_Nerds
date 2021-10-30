const mongoose  = require("mongoose")
const bcryptjs = require('bcryptjs')

let userSchema = new mongoose.Schema({
    name: {
        type: String,
        lowercase: true, 
        required: [true, "can't be blank"], 
    },
    username: {
        type: String, 
        required: [true, "can't be blank"], 
        match: [/^[a-zA-Z0-9]+$/, 'is invalid'], 
        unique: true
    },
    email: {
        type: String, 
        lowercase: true, 
        required: [true, "can't be blank"], 
        match: [/\S+@\S+\.\S+/, 'is invalid'], 
        unique: true
    },
    password: {
        type: String, 
        required: [true, "can't be blank"],
    },
    mobileNo : {
        type: String, 
        required: [true, "can't be blank"],
        minLength : [10 , "Mobile no must be 10 digit exact"]  ,
        maxlength: [10 , "Mobile no must be 10 digit exact"] ,
        unique: true
    }
})

userSchema.pre('save', function (next) {
    this.password = bcryptjs.hashSync(this.password, 10);
    next();
});


userSchema.statics.login = async function (username, password) {
    const user = await this.findOne({ "username" :  username });
    if (user) {
      const auth = await bcryptjs.compareSync(password , user.password)
      if (auth) {
        return user;
      }
      throw Error('incorrect password'); 
    }
    throw Error('incorrect username');
};
 
let UserModel =  mongoose.model("users", userSchema)
module.exports = UserModel;