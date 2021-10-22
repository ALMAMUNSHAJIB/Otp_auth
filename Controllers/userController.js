const bcrypt = require('bcrypt');
const _ = require('lodash');
const axios = require('axios');
const optGenerate = require('otp-generator');

const {User} = require('../Models/user');
const {Otp} = require('../Models/otp');


module.exports.signUp = async(req, res)=>{
  const user = await User.findOne({
      number: req.body.number
  });
  if(user) return res.status(404).json({message: 'User already register'});

  const OTP = optGenerate.generate(6, {
      digits: true, alphabets: false, upperCase: false, specialChars: false
  });
  const number = req.body.number;
  console.log(OTP);
//========Implementation BUl sms==============//
//   const greenWeb = new URLSearchParams();
//   greenWeb.append('token', '-------------');
//   greenWeb.append('to', `+${number}`);
//   greenWeb.append('message', `Verification Code ${OTP}`);
//   axios.post('http://api.greenweb.com.bd/api.php', greenWeb).then(response => {
//       console.log(response.data);
//   })

  const otp = new Otp({number: number, otp: OTP});
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  otp.save();

  return res.status(200).json({message: 'Otp send successfully!!'});
};


module.exports.verifyOtp = async(req, res) => {

    const otpHolder = await Otp.find({
        number: req.body.number
    });
    if(otpHolder.length === 0) return res.status(500).json({message: 'You use an expires OTP'});
    const rightFindOtp = otpHolder[otpHolder.length -1];
    const valiUser = await bcrypt.compare(rep.body.otp, rightFindOtp.otp);

    if(rightFindOtp.number === req.body.number && valiUser){
        const user = new User(_.pick(req.body, ["number"]));
        const token = user.generateJWT();
        const result = await user.save();

        const OtpDelete = await Otp.deleteMany({
            number: rightFindOtp.number
        });



        return res.status(200).json({
            message: "User regisitation Successfull",
            token: token,
            data: result
        })
    }else{
        return res.status(400).json({message: 'Your Otp is wrong!!'})
    }

};