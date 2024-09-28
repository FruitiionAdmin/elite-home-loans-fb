require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import addDollarAmounts from '../../functions/addDollarAmounts';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async (req,res) => {
    const {investors, deal, distributionAmount, distributionMemo} = req.body
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

    let options

    //updateDeal distributed and distributions

    try {
        let currentDistributions = deal.distributions ? deal.distributions : []
        let currentDistributed = deal.distributed
    
        currentDistributions.push({amount:distributionAmount, memo:distributionMemo, timestamp: Date.now()})
        let newDistributed = addDollarAmounts(currentDistributed, distributionAmount)
    
        const updateDeal = await db
            .collection("deals")
            .updateOne(
                {_id: objectId(deal._id)},
                {
                    "$set": {
                        distributed: newDistributed,
                        distributions: currentDistributions
                    }
                },
                {upsert:true}
            );
    } catch (e) {
        console.log(e)
        res.status(200).json({result: "DB update Error"})
        return
    }

    
    //email investors

    try {
        await Promise.all(investors.map( async (investor) => {
            options = {
                from: 'Fruitiion Distribution <info@fruitiion.com>',
                to: investor.email,
                subject: 'Fruitiion Distribution',
                html: generateEmailstring('Fruitiion Distribution', investor.name, distributionMemo, [`A distribution from the ${deal.nickname} was made.`,'You can go to your investment admin page for more details.','Please be aware that amount shown there are estimates based on the equity reflected on the application.','The actual amount may vary.'], [[`${currentDomain}/gateway/investmentAdmin/${investor._id.toString()}`, 'Investment Admin']], "")
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
        res.status(200).json({result: "email Error"})
        return
    }
    res.status(200).json({result: "success"})
    
}