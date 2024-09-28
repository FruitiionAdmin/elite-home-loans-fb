require('dotenv').config();
const crypto = require('crypto');


export default function (pw, email) {
  var mykey = crypto.createCipher('aes-128-cbc', pw);
  var mystr = mykey.update(process.env.SALT1 + email + process.env.SALT2);
  return mystr += mykey.final('hex');
}