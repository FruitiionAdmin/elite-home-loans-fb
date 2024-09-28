require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async (req, res) => {
    if (req.method === "POST") {
        const {deal, message, investors, applicants} = req.body
        const {db} = await connectToDatabase()
        let investorsToBeContacted;

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
        //updateDeal
        
        try {
            const updateDeal = await db
                .collection("deals")
                .updateOne(
                    {_id: objectId(deal._id)},
                    {
                        "$set": {
                            status: "Funded"
                        }
                    },
                    {upsert:true}
                )
        } catch (e) {
            console.log(e)
            res.status(405).json({result: 'update deal error'});
            return
        }

        //updateInvestments
        try {
            const updateApplicants = await db
                .collection("investments")
                .updateMany(
                    {dealId: deal._id.toString(), status: {"$ne":"Active"}},
                    {
                        "$set": {
                            status: "Application Closed"
                        }
                    },
                    {upsert:false}
                )
        } catch (e) {
            console.log(e)
            res.status(405).json({result: 'update investments error'});
            return
        }
        
        //send message to investors
        try {
            investorsToBeContacted = deal.status == "Funded" ? investors : investors.concat(applicants)

            await Promise.all(investorsToBeContacted.map( async (investor) => {
                let options = {
                    from: 'Fruitiion Deal Funded <info@fruitiion.com>',
                    to: investor.email,
                    subject: 'Fruitiion Deal Funded',
                    html: generateEmailstring("Deal Funded", investor.name, message, [`The ${deal.nickname} deal has been funded`],[[`${currentDomain}/gateway/investmentAdmin/${investor._id.toString()}`, 'View Investment']])
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
            res.status(200).json({result: 'success'});
        } catch (e) {
            console.log(e)
            res.status(405).json({result: 'email error'});
            return
        }
    } else {
        res.status(405).json({error: 'Error'});
    }
}