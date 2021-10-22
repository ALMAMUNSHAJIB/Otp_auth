const {Schema, Model, model} = require('mongoose');
const jwt = require('jsonwebtoken');


const userSchema = Schema({
    number: {
        type: String,
        required: true
    }
}, {timestamps: true});


userSchema.methods.generateJWT = function(){
    const token = jwt.sign({
        _id: this._id,
        number: this.number
    }, process.env.JWT_SECRET_KEY, {expiresIn: '1h'})
};


module.exports.User = model('User', userSchema);