require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import addDollarAmounts from '../../functions/addDollarAmounts';
import generateEmailstring from '../../functions/generateEmailString';
import { currentDomain } from '../../const';

export default async  (req, res) => {
    const {applicant, deal} = req.body

    const {db} = await connectToDatabase()
    
    let dealUpdate

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

    //updateInvestment
    //updateDeal
    //emailInvestor

    

    try {
        let currentRaiseString = deal.raised
        let investmentAmountString = applicant.investmentAmount
        
        //addThemTogether
        const newRaised = addDollarAmounts(currentRaiseString,investmentAmountString)
        dealUpdate = {raised: newRaised}
        if (newRaised >= deal.totalRaise) {
            dealUpdate.status = "Funded"
        }
        //updateDeal
        const updateDeal = await db
            .collection("deals")
            .updateOne(
                {_id: objectId(deal._id)},
                {
                    "$set": {
                        raised: newRaised
                    }
                },
                {upsert:true}
            );
    } catch (e) {
        console.log(e)
        res.status(405).json({result: 'deal DB error'});
        return
    }

    try {
        const updateInvestment = await db
            .collection("investments")
            .updateOne(
                {_id: objectId(applicant._id)},
                {
                    "$set": {
                        status: "Active"
                    }
                },
                {upsert:true}
            );
    } catch (e) {
        console.log(e)
        res.status(405).json({result: 'investment DB error'});
        return
    }

    try {

        let options = {
            from: 'Fruitiion Investment Application <info@fruitiion.com>',
            to: applicant.email,
            subject: 'Fruitiion Investment Application',
            html: generateEmailstring('Investment Application',applicant.name,"", [`Congratulations, the sponsor has received your payment for the investment for the ${deal.nickname} opportunity and you are officially an active investor.`],[[`${currentDomain}/gateway/investmentAdmin/${applicant._id.toString()}`, "View Investment"]],"")
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
        res.status(405).json({result: 'Email error'});
        return
    }

    try {
        if (dealUpdate.status == "Funded") {
            //findActiveInvestments
            const activeInvestments = await db
                .collection("investments")
                .find({dealId: deal._id.toString(), status: "Active"})
                .toArray()
            //updateInvestments
        // try {
        //     const updateApplicants = await db
        //         .collection("investments")
        //         .updateMany(
        //             {dealId: deal._id.toString(), status: {"$ne":"Active"}},
        //             {
        //                 "$set": {
        //                     status: "Application Closed"
        //                 }
        //             },
        //             {upsert:true}
        //         )
        // } catch (e) {
        //     console.log(e)
        //     res.status(405).json({result: 'update investments error'});
        //     return
        // }
            //getInvestorsInfo
            const investorsInfo = await Promise.all(activeInvestments.map( async (investment) => {
                let investorId = investment.investor
                let investor = await db
                    .collection("investors")
                    .findOne({_id: objectId(investorId)})
                return investor
            }))

            await Promise.all(investorsInfo.map( async (investorInfo) => {
                let options = {
                    from: 'Fruitiion Deal Funded <info@fruitiion.com>',
                    to: investorInfo.email,
                    subject: 'Fruitiion Deal Funded',
                    html: `<h3>Deal Funded</h3><br /><p>Hello ${investorInfo.firstName},</p><p>The ${deal.nickname} has been funded!</p><br /><p>- The Fruitiion team.</p>`
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
            
        }
    } catch (e) {
        console.log(e)
        res.status(405).json({result: 'Funded Email error'});
        return
    }

    res.status(200).json({result: "success"})
}
