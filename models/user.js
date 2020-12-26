const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: false
  },
  resetKey: {
    type: String,
    required: false
  }
});

UserSchema.pre('save', function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.hash(user.password, 10, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  } else {
    next();
  }
});

// UserSchema.method('validPassword', function (password) {
//   bcrypt.compare(password, this.password, (err, isMatch) => {
//     return isMatch;
//   });
// });

var User = mongoose.model("User", UserSchema);

module.exports = User;