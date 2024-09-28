require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import salt from '../../functions/salt';
import { currentDomain } from '../../const';
import generateEmailstring from '../../functions/generateEmailString';

export default async (req, res) => {
    if (req.method === "POST") {
       let { code, collection, email, password} = req.body
       let reset;
       let user
       
       const {db} = await connectToDatabase()

       var transporter = nodemailer.createTransport({
            host: "smtp.office365.com", // hostname
            secureConnection: true, // TLS requires secureConnection to be false
            port: 587, // port for secure SMTP
            tls: {
                ciphers:'SSLv3'
            },
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PW
            }
            
        });
        //findReset
        try {
            reset = await db
                .collection(`${collection}Reset`)
                .findOne({email:email})
            if (!reset) {
                console.log("no reset found")
                res.status(200).json({invalid: "invalid"});
                return
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'Search Error'});
        }
        //verifyInfo
        try {
            if (reset.code != salt(code)) {
                console.log("no reset found")
                res.status(200).json({invalid: "invalid"});
                return
            }
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'Validation Error'});
        }
        //processReset
        try {
            user = await db
                .collection(collection)
                .findOneAndUpdate(
                    {email: email},
                    {
                        "$set": {
                            password: salt(email,password)
                        }
                    },
                )
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'Update Error'});
        }

        try {
            let options = {
                from: 'Fruitiion Password Reset <info@fruitiion.com>',
                to: email,
                subject: 'Fruitiion Password Reset',
                html: generateEmailstring('Fruitiion Password Reset', user.firstName,"", ['Your password has been reset.','Please contact us at info@fruitiion.com if you did not reset your password.'],"","")
            }
            transporter.sendMail(options, function(error, info) {
                if (error) {
                  console.log(error)
                } else {
                  console.log("success")
                }
            });
           } catch (e) {
            console.log(e)
            res.status(405).json({error: 'email error'});
            return
           }

        res.status(200).json({result:"success"});
    } else {
        res.status(405).json({error: 'Error'});
    }
}