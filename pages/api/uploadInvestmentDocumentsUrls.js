require('dotenv').config();
import nodemailer from 'nodemailer';
import { currentDomain } from '../../const';
import { connectToDatabase, objectId } from '../../database';
import generateEmailstring from '../../functions/generateEmailString';

export default async (req, res) => {
    if (req.method === "POST") {
        let deal = req.body.deal
        try {
            const { db } = await connectToDatabase();
            const updateInvestment = await db
                .collection('investments')
                .updateOne(
                    {_id: objectId(req.body.investmentId)},
                    {
                        "$set": {
                            status: "Documents Submitted"
                        },
                        "$push": {
                            documents: { "$each" : req.body.documents}
                        }
                    },
                    {upsert:true}
                );
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
            return
        }

        try {
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

            let sponsors = deal.sponsors

            await Promise.all (sponsors.map( async (sponsor) => {
                let options = {
                    from: 'Fruitiion Investor Documents <info@fruitiion.com>',
                    to: sponsor[1],
                    subject: 'Fruitiion Investor Documents',
                    html: generateEmailstring('Investor Documents',sponsor[0],"",[`Documents for the ${deal.nickname} deal have been submitted.`,'Please log on and review the investor documents in the deal admin page.'],[[`${currentDomain}/gateway/dealAdmin/${deal._id.toString()}`,"Deal Admin"]], "")
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
                });
            }))
            res.status(200).json({result: 'success'});
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'email error'});
            return
        }
    } else {
        res.status(405).json({error: 'Error'});
    }
}