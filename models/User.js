const { Schema, model } = require('mongoose');


const EMAIL_PATTERN = /^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA-Z]+)$/

const userSchema = new Schema({
  email: {type: String, required: [true, 'Email is required'], validate: {
    validator(value){
        return EMAIL_PATTERN.test(value)
    },
    message: 'Email not valid'
}, minlength: [10, 'Email must be at least 10 characters long']},
  username: {type: String, required: true, minlength: [4, 'Username must be at least 4 characters long']},
  hashedPassword: {type: String, required: true} 
});

userSchema.index( {email: 1} , {
  unique:true,
  collation: {
      locale: 'en',
      strength: 2
  }
});

const User = model('User', userSchema);

module.exports = User;