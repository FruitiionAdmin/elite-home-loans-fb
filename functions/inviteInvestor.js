require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import generateEmailstring from './generateEmailString';
import { currentDomain } from '../const';
import nodemailer from 'nodemailer';

export default async function  inviteInvestor(body) {
    try {
        const { db } = await connectToDatabase();
        //look for existing sponsor account
        const investorCheck = await db
            .collection('investors')
            .findOne({email: body.email});
        if (investorCheck) {
            return {result:'success', message: 'account already exists'}
        }
        //write text info to db
        const investor = await db
            .collection('investors')
            .insertOne({
                email: body.email,
                invitationName: body.invitationName,
                status: "Invited"
            })
        
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
            subject: 'Investor Invitation',
            html: generateEmailstring("Invitation", body.invitationName, body.message, ["You have been invited to become an investor.", "Please use the button below to complete your registration."],[[`${currentDomain}/register/`,'Complete Registration']], "")
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

        return {result:"success", investorId: investor.insertedId}   
    } catch (e) {
        console.log(e)
        return {result:"error", message: e}
    }
}