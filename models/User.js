const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt= require('bcrypt')

//salt round
const SALT_ROUNDS= 6;


const userSchema = new Schema({
    name: {type: String, required: true},
    email: {
      type: String,
    //   email is unique and the value hasn't been taken 
      unique: true,
    //   takes away empty spaces
      trim: true,
      lowercase: true,
      required: true
    },
    password: {
      type: String,
      trim: true,
      minLength: 3,
      required: true
    }
  }, {timestamps: true,
    toJSON:{
        transform: function(doc, ret){
            delete ret.password
            return ret;
        }
    }
});

    //pre-save hook next- next step
   userSchema.pre('save', async function(next){
    //"this " is the user doc/ if the password has not been modified 
    if (!this.isModified('password')) return next();
    this.password= await bcrypt.hash(this.password, SALT_ROUNDS)
    return next()
   })


module.exports = mongoose.model('User', userSchema);