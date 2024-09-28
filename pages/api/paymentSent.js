require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async (req, res) => {
    if (req.method === "POST") {

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
        try {
            const { db } = await connectToDatabase();

            const updateInvestment = await db
                .collection('investments')
                .findOneAndUpdate(
                    {_id: objectId(req.body.investmentId)},
                    {
                        "$set": {
                            status:"Payment Sent"
                        }
                    },
                    {upsert:true}
                );

            const deal = await db
                    .collection("deals")
                    .findOne({_id: objectId(updateInvestment.dealId)})

            const sponsors = deal.sponsors

            await Promise.all(sponsors.map( async (sponsor) => {
                options = {
                    from: 'Fruitiion Payment Sent <info@fruitiion.com>',
                    to: sponsor[1],
                    subject: 'Fruitiion Payment Sent',
                    html: generateEmailstring('Fruitiion Payment Sent', sponsor[0], "", [`A payment for investing in ${deal.nickname} was made.`,'Once you verify that you have recieved payment, login to your deal admin page and confirm you have recieved payment for the apprpriate investment to finalize it on the platform.'],[[`${currentDomain}/gateway/dealAdmin/${updateInvestment.dealId}`,"Deal Admin"]], "")
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
            res.status(200).json({result:"success"});    
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
        }
    } else {
        res.status(405).json({error: 'Error'});
    }
}