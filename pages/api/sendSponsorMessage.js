require('dotenv').config();
import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
import { connectToDatabase, objectId } from '../../database';

export default async (req, res) => {
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

    const { db } = await connectToDatabase();

    const sponsors = await db
                .collection('sponsors')
                .find()
                .toArray()
                
    let message = req.body.message
    let returnEmail = req.body.returnEmail
    let options


    try {

        await Promise.all(sponsors.map( async (sponsor) => {
            options = {
                from: 'Fruitiion Investor Inquiry <info@fruitiion.com>',
                to: sponsor.email,
                subject: 'Fruitiion Investor Inquiry',
                html: generateEmailstring('Investor Inquiry',sponsor.firstName, "", ['The message below is from a user on the Fruitiion platform.',`${message}`,`please respond to this email ---> ${returnEmail}`],[],"")
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
        }))

    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
        return
    }
    res.status(200).json({result: "succes"})
}