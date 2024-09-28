require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';
import { NextResponse } from "next/server";
import { currentDomain } from '../../const';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
        
    let deal
    let userType
    let dealId
    let completeInvestments
    let applicants = []
    let investors = []
    let applicantAlert = false
    if (token) {
        decoded = await jwtVerify(token, secret)
        userType = decoded.payload.type
    } else {
        userType = "guest"
    }

    const { db } = await connectToDatabase();

    try {
        dealId = objectId(req.body.dealId)
    } catch (e) {
        res.status(200).json({result: "no deal found"})
        return
    }

    try {
        
        deal = await db
            .collection("deals")
            .findOne({_id: dealId})
        if (deal == null) {
            res.status(200).json({result: "no deal found"})
            return
        }

        if (deal.sponsor != decoded.payload.id) {
            res.status(200).json({result: "unauthorized"})
            return
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "deals error"})
        return
    }

    try {
        let investments = await db
            .collection("investments")
            .find({dealId: req.body.dealId})
            .toArray()
        //get profile pic, first, last, email, phone number
        if (investments.length > 0) {
            completeInvestments = await Promise.all( investments.map( async (investment) => {
                let investor = await db
                    .collection("investors")
                    .findOne({_id: objectId(investment.investor)})
    
                investment.profilePic = investor.profilePicture
                investment.name = `${investor.firstName} ${investor.lastName}`
                investment.email = investor.email
                investment.phoneNumber = investor.phoneNumber
                investment.totalRaise = deal.totalRaise
                investment.nickname = deal.nickname
                if (investment.status == "Pending" || investment.status == "Documents Submitted" || investment.status == "Payment Sent") {
                    applicantAlert = true
                }
                
                (investment.status == "Active" || investment.status == "Investment Closed") ?
                    investors.push(investment) :
                    applicants.push(investment)
                return investment
            }))
        }
        
        res.status(200).json({result: "success", investors, applicants, userType, deal, applicantAlert})

    } catch (e) {
        console.log(e)
        res.status(500).json({result: "investments error"})
        return
    }

    
}