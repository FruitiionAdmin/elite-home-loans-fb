require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async (req, res) => {

    const { applicant, decision, comments} = req.body

    let investorMessage;
    let sponsorMessage;
    let deal
    let investorOptions;
    let sponsorOptions;

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
    if (req.method === "POST") {
        //updateInvestment
        try {
            const updateInvestment = await db
            .collection("investments")
            .updateOne(
                {_id: objectId(applicant._id)},
                {
                    "$set": {
                        status: decision
                    }
                },
                {upsert:true}
            );
        } catch (e) {
            console.log(e)
            res.status(200).json({result: 'DB error'});
            return
        }
        
        //emailInvestor
        try {
            deal = await db
                .collection("deals")
                .findOne({_id: objectId(applicant.dealId)})
            
            if (decision == "Awaiting Payment") {
                investorMessage = generateEmailstring('Investment Application', applicant.name, comments, [`Congratulations, the sponsor has accepted your documents regarding the ${deal.nickname} opportunity.`,'A member of the sponsor team should contact you about arranging payment.'],[[`${currentDomain}/gateway/investmentAdmin/${applicant._id.toString()}`, 'Investment Admin']],"")

            } else if (decision == "Rejected") {
                investorMessage = generateEmailstring('Investment Application',applicant.name, comments, [`Unfortunately, the sponsor has rejected your documents regarding the ${deal.nickname} opportunity.`,'Although this opportunity did not work out, there are more offerings on the Fruitiion platform you can try.'],[[`${currentDomain}/app/offerings`,'View Offerings']],"")
            } else {
                investorMessage = generateEmailstring('Investment Application', applicant.name, comments, [`The sponsor for the ${deal.nickname} opportunity has requested that you resubmit your documents.`,'Please review the comments below for more information on what the sponsor is expecting from your documents.'], [[`${currentDomain}/gateway/investmentAdmin/${applicant._id.toString()}`, 'Investment Admin']],"")
            }

            investorOptions = {
                from: 'Fruitiion Investment Application <info@fruitiion.com>',
                to: applicant.email,
                subject: 'Fruitiion Investment Application',
                html: investorMessage
            }

            await new Promise((resolve, reject) => {
                transporter.sendMail(investorOptions, function(error, info) {
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
            res.status(200).json({result: 'investor email error'});
            return
        }
       
        //emailSponsor
        try {
            let sponsors = deal.sponsors
            
            if (decision == "Awaiting Payment") {
                Promise.all(sponsors.map( async (sponsor) => {
                    sponsorOptions = {
                        from: 'Awaiting Investor Payment <info@fruitiion.com>',
                        to: sponsor[1],
                        subject: 'Awaiting Investor Payment',
                        html: generateEmailstring('Awaiting Investor Payment',sponsor[0],"",[`An investors documents regarding the ${deal.nickname} deal have been approved.`,'Please use the contact information below to arrange payment for their investment.','Once payment has been recieved, please go to the admin section for the deal and confirm the payment has been recieved to finalize the investment.','Investor contact information:',`${applicant.name}`,`${applicant.email}`,`${applicant.phoneNumber}`], [[`${currentDomain}/gateway/dealAdmin/${deal._id.toString()}`,'Deal Admin']], "")
                    }
    
                    await new Promise((resolve, reject) => {
                        transporter.sendMail(sponsorOptions, function(error, info) {
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
            }

            

        } catch (e) {
            console.log(e)
            res.status(200).json({result: 'sponsor email error'});
            return
        }



        res.status(200).json({result: "success"})
    } else {
        res.status(405).json({error: 'Error'});
    }
}