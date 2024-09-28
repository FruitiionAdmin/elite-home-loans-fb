require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import { jwtVerify } from 'jose';
import nodemailer from 'nodemailer';
import generateEmailstring from './generateEmailString';
import { currentDomain } from '../const';

export default async function createNewInvestment(body, cookies) {
    
    
    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = cookies.auth
    const decoded = await jwtVerify(token, secret)
    const investorId = decoded.payload.id
    const {db} = await connectToDatabase();

    let deal
    let sponsor

    if (!token) {
        return {result:"not authenticated", message:"not authenticated" }
    }

    let experience = []
    let investment

    if (body.stocks) {
        experience.push ("Stocks")
    }

    if (body.bonds) {
        experience.push ("Bonds")
    }
    
    if (body.reits) {
        experience.push ("REITs")
    }

    if (body.business) {
        experience.push ("Business")
    }

    if (body.realEstate) {
        experience.push ("Real Estate")
    }

    if (body.notes) {
        experience.push ("Notes")
    }

    if (body.mutualFunds) {
        experience.push ("Mutual Funds")
    }

    if (body.etfs) {
        experience.push ("ETFs")
    }

    if (body.commodities) {
        experience.push ("Commodities")
    }

    if (body.stockOptions) {
        experience.push ("Stock Options")
    }

    if (body.crypto) {
        experience.push ("Crypto")
    }

    if (body.other) {
        experience.push ("Other")
    }

    try {
        investment = await db
        .collection("investments")
        .insertOne({
            investor: investorId,
            dealId: body.dealId,
            networth: body.networth,
            income: body.income,
            investmentLength: body.investmentLength,
            investmentAmount: body.investmentAmount,
            status: "Pending",
            experience: experience
        })
     
    } catch (e) {
        console.log(e)
        return {result:"writeDealError", message: e}
    }

    try {
        deal = await db
            .collection("deals")
            .findOne({_id: objectId(body.dealId)})
        
        sponsor = await db
            .collection("sponsors")
            .findOne({_id: objectId(deal.sponsor)})


    } catch (e) {
        console.log(e)
        return {result:"sponsorDataError", message: e}
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

        let options = {
            from: 'Fruitiion New Investor Application <info@fruitiion.com>',
            to: sponsor.email,
            subject: 'Fruitiion New Investor Application',
            html: generateEmailstring('Fruitiion New Investor Application', sponsor.firstName, "", [`Someone has applied to invest in ${deal.nickname}.`,'Please go to you deals page to review the investment.'],[[`${currentDomain}/gateway/dealAdmin/${deal._id.toString()}`, "Deal Admin"]],"")
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
        return {result:"emailError", message: e}
    }

    return {result:"success", investmentId: investment.insertedId}
}