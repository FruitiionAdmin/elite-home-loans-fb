require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import generateEmailstring from './generateEmailString';
import { currentDomain } from '../const';
import nodemailer from 'nodemailer';
import { jwtVerify } from 'jose';

export default async function  addSponsor(body,cookies) {
    try {
        const { db } = await connectToDatabase();


        const secret = new TextEncoder().encode(process.env.JDUB)
        const token = cookies.auth
        const decoded = await jwtVerify(token, secret)

        if (!decoded.payload.superUser) {
            return {result:'success', message: 'not authorized for this action'}
        }

        //look for existing sponsor account
        const sponsorCheck = await db
            .collection('sponsors')
            .findOne({email: body.email});
        if (sponsorCheck) {
            return {result:'success', message: 'account already exists'}
        }
        //write text info to db
        const sponsor = await db
            .collection('sponsors')
            .insertOne({
                email: body.email,
                invitationName: body.invitationName,
                status:"Invited",
                owner:false,
                superUser: false,
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
            subject: 'Sponsor Invitation',
            html: generateEmailstring("Invitation", body.invitationName, body.message, ["You have been invited to become an investor.", "Please use the button below to complete your registration."],[[`${currentDomain}/sponsorRegister/`,'Complete Registration']], "")
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

        return {result:"success", sponsorId: sponsor.insertedId}   
    } catch (e) {
        console.log(e)
        return {result:"error", message: e}
    }
}