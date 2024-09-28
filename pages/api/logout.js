require('dotenv').config();
import cookie from 'cookie';
import {cookieExp} from '../../const';
import { SignJWT } from 'jose';

export default async (req, res) => {
  
  let result
  const secret = new TextEncoder().encode(process.env.JDUB)
  
  try {
    res.setHeader('Set-Cookie', [
      cookie.serialize('auth', req.body.test, {
        httpOnly: true,
        sameSite: true,
        maxAge: cookieExp,
        path: '/'
      })
    ]);

    result = "success"
    res.status(200).json({ result })
  } catch (e) {
    console.log(e)
    result = "error"
    res.status(200).json({ result })
  }
  
}