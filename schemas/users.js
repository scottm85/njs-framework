const mongoose  = require("mongoose"),
      bcrypt    = require("bcrypt-nodejs");
    
let userSchema = mongoose.Schema({
    name        : String,
    email       : String,
    password    : String,
    tnc         : Boolean,
    apikey      : String,
    active      : Boolean
});

// Methods ======================
// Generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);