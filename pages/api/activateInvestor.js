require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async (req, res) => {
    if (req.method === "POST") {
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

            const { db } = await connectToDatabase();
            //look for existing sponsor account
            const updateInvestor = await db
                .collection('investors')
                .findOneAndUpdate(
                    {_id: objectId(req.body.id)},
                    {
                        "$set": {
                            status: "Active"
                        }
                    },
                    {upsert:false}
                );
                let options = {
                    from: 'Fruitiion Account Activated <info@fruitiion.com>',
                    to: updateInvestor.email,
                    subject: 'Fruitiion Investment Application',
                    html: generateEmailstring('Investor Application', updateInvestor.firstName, "comments", [`You have been aproved to use the Fruitiion Application.`,'Please use the link below to sign into the platform.'], [[`${currentDomain}/inestorLogin}`, 'Login']],"")
                }
            res.status(200).json({result:"success"});    
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
        }
    } else {
        res.status(405).json({error: 'Error'});
    }
}