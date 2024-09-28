require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import salt from './salt';
import nodemailer from 'nodemailer';
import { currentDomain } from '../const';
import generateEmailstring from './generateEmailString';


export default async function  createInvestor(body) {
    try {
        const { db } = await connectToDatabase();
        //look for existing sponsor account
        const investorCheck = await db
            .collection('investors')
            .findOne({
                email: body.email,
                status: "Invited"
            });
        if (investorCheck == null) {
            return {result:'success', message: 'Invitation does not exist'}
        }
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
            from: 'Fruitiion <info@fruitiion.com>',
            to: body.email,
            subject: 'Sponsor Invitation',
            html: generateEmailstring("Pending Review", body.firstName, "", ["Thank you for completing your application.", "We are currently reviewing your information.","You will be notified with our decision shortly."],[[`${currentDomain}/investorLogin/`,'Pending Review']], "")
        }
        //write text info to db
        const investor = await db
            .collection('investors')
            .findOneAndUpdate(
                {
                    _id:objectId(investorCheck._id)
                },
                {
                    "$set": {
                        firstName: body.firstName,
                        lastName: body.lastName,
                        middleInitial: body.middleInitial,
                        suffix: body.suffix,
                        email: body.email,
                        password: salt(body.email,body.password),
                        selfCode: body.selfieCode,
                        status: "Pending",
                        phoneNumber: body.phoneNumber
                    }
                    
                },
                {
                    upsert: false
                }

        )
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
        return {result:"success", investorId: investorCheck._id}   
    } catch (e) {
        console.log(e)
        return {result:"error", message: e}
    }
}