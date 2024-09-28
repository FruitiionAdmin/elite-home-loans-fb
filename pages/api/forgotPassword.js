require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import generateSelfieString from '../../functions/generateSelfieString';
import salt from '../../functions/salt';
import { currentDomain } from '../../const';
import generateEmailstring from '../../functions/generateEmailString';

export default async (req, res) => {
    if (req.method === "POST") {
       let userType = req.body.userType
       let email = req.body.email
       let collection;
       let code = generateSelfieString()
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

        if (userType == "sponsor") {
            collection = "sponsors"
        } else {
            collection = "investors"
        }

        try {
            user = await db
                .collection(collection)
                .findOne({email: email})
            if (!user) {
                console.log("no user found")
                res.status(200).json({result: "inquiry recieved"});
                return
            }
        } catch (e) {
            console.log(e)
            res.status(405).json({error: 'search error'});
            return
        }

        try {
            const reset = await db
                .collection(`${collection}Reset`)
                .updateOne(
                    {email: email},
                    {
                        "$set": {
                            code: salt(code),
                            timestamp: Date.now()
                        }
                    },
                    {upsert:true}
                )
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
        }

        try {
            let options = {
                from: 'Fruitiion Password Reset <info@fruitiion.com>',
                to: email,
                subject: 'Fruitiion Password Reset',
                html: generateEmailstring("Fruitiion Password Reset", user.firstName, "", ["Your password reset code is below."],[[`${currentDomain}/passwordReset/${collection}`,'Please use this link to reset your password']], code)
            }
            await new Promise((resolve, reject) => {
                transporter.sendMail(options, function(error, info) {
                    if (error) {
                    console.log(error)
                    reject(error)
                    } else {
                    console.log("success")
                    resolve(info)
                    }
                })
            })
        } catch (e) {
            console.log(e)
            res.status(405).json({error: 'email error'});
            return
        }
        res.status(200).json({result: "Inquiry Recieved"});
        return
    } else {
        res.status(405).json({error: 'Error'});
    }
}