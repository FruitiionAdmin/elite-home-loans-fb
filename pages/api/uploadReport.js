require('dotenv').config();
import { currentDomain } from '../../const';
import { connectToDatabase, objectId } from '../../database';
import generateEmailstring from '../../functions/generateEmailString';
import nodemailer from 'nodemailer';

export default async (req, res) => {
    if (req.method === "POST") {
        const {deal, url, name, memo, investors} = req.body
        
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

        let options

        try {
            const { db } = await connectToDatabase();
            const updateSponsor = await db
                .collection('deals')
                .updateOne(
                    {_id: objectId(deal._id)},
                    {
                        "$push": {
                            reports: {url,name,timestamp: Date.now(), memo}
                        }
                    },
                    {upsert:true}
                );
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
        }

        try {
            await Promise.all(investors.map( async (investor) => {
                options = {
                    from: 'Fruitiion Report Published <info@fruitiion.com>',
                    to: investor.email,
                    subject: 'Fruitiion Report Published',
                    html: generateEmailstring('Report Published',investor.name, memo, [`The sponsor for the ${deal.nickname} deal has published a report.`, 'Please go to your investment admin to view the report.'],[[`${currentDomain}/gateway/investmentAdmin/${investor._id.toString()}`, 'Investment Admin']],"")
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
            res.status(500).json({result: "email error"})
            return
        }

        res.status(200).json({result:"success"});
    } else {
        res.status(405).json({error: 'Error'});
    }
}