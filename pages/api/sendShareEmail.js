require('dotenv').config();
import nodemailer from 'nodemailer';
import { currentDomain } from '../../const';
import generateEmailstring from '../../functions/generateEmailString';

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

    let emails = req.body.emails
    let deal = req.body.deal
    let options


    try {

        await Promise.all(emails.map( async (email) => {
            options = {
                from: 'Fruitiion Investment Offering <info@fruitiion.com>',
                to: email,
                subject: 'Fruitiion Investment Offering',
                html: generateEmailstring('Investment Offering', "", "", ['Someone thought you would be interested in the opportunity linked below.',`Check out the ${deal.nickname} deal.`],[[`${currentDomain}/dealDetail/${deal._id}`, "View Deal"]],"")
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