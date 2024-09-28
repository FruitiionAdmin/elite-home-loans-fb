require('dotenv').config();
import cookie from 'cookie';
import salt from '../../functions/salt'
import { connectToDatabase, objectId } from '../../database';
import {cookieExp} from '../../const';
import { SignJWT } from 'jose';

export default async (req, res) => {
  
  let result
  const secret = new TextEncoder().encode(process.env.JDUB)
  try {
    const { db } = await connectToDatabase();
    const user = await db
      .collection("sponsors")
      .findOne({email: req.body.email});
    if (user) {
      let superUser = user.superUser
      if (user.status === "Active") {
        if (user.password === salt(req.body.email,req.body.password)) {
          const claims = {id: user._id, type: "sponsor", superUser:superUser, exp: cookieExp};
          const jwt = await new SignJWT(claims)
            .setProtectedHeader({ alg: 'HS256'})
            .setIssuedAt()
            .setExpirationTime('2h')
            .sign(secret)
          res.setHeader('Set-Cookie', [
            cookie.serialize('auth', jwt, {
              httpOnly: true,
              sameSite: true,
              maxAge: cookieExp,
              path: '/'
            })
          ]);
          result = "success"
        } else {
          result = "Password is incorrect"
        }
      } else {
        result = "Your account is under review"
      }
      
    } else {
      result = 'User not found'
    }

    res.status(200).json({ result: result })
  } catch (e) {
    console.log(e)
    res.status(405).json({error: 'Error'});
  }
}