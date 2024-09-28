require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import nodemailer from 'nodemailer';
import { currentDomain } from '../../const';
import generateEmailstring from '../../functions/generateEmailString';

export default async (req, res) => {

    const { applicant, decision, adjustedInvestmentAmount, comments, deal} = req.body
    const {db} = await connectToDatabase()
    console.log(decision)
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
            let investmentData = {}

            if (decision == "Accept") {
                investmentData.status = "Awaiting Documents"
            } else {
                investmentData.status = "Rejected"
            }

            if (adjustedInvestmentAmount != "") {
                investmentData.investmentAmount = adjustedInvestmentAmount
            }
            console.log(investmentData)
            const updateInvestment = await db
                .collection('investments')
                .updateOne(
                    {_id: objectId(applicant._id)},
                    {
                        "$set": investmentData
                    },
                    {upsert:true}
                );
        } catch (e) {
            console.log(e)
            res.status(405).json({result: 'DB error'});
        }

        //notifyInvestor
        try {
            let message
            let paragraphs = []
            let completeParagraphs
            if (adjustedInvestmentAmount != "") paragraphs.push(`The sponsor for ${deal.nickname} has adjusted your investment amount to ${adjustedInvestmentAmount}.`)
            if (decision == "Accept") {
                completeParagraphs = paragraphs.concat(["Congratulations, the sponsor has accepted your application to invest.","Please go to your investment admin page to download the documents required to invest.","Once you have filled out the documents properly you can upload them on the same page."])
                message = generateEmailstring("Investment Application", applicant.name, comments, completeParagraphs, [[`${currentDomain}/gateway/investmentAdmin/${applicant._id.toString()}`, "View Investment"]],"")
            } else {
                completeParagraphs = paragraphs.concat(["Unfortunately, the sponsor has decided not to move forward with your application.","Although this opportunity did not work out, there are more offerings on the Fruitiion platform you can try."], "", "")
                message = generateEmailstring("Investment Application", applicant.name, comments, completeParagraphs)
            }

            let options = {
                from: 'Fruitiion Investment Application <info@fruitiion.com>',
                to: applicant.email,
                subject: 'Fruitiion Investment Application',
                html: message
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
        }

        res.status(200).json({result: "success"})
    } else {
        res.status(405).json({error: 'Error'});
    }
}