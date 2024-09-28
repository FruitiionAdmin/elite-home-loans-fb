require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
        
    let deal
    let userType
    let investment
    let investmentId
    let sponsors

    if (token) {
        decoded = await jwtVerify(token, secret)
        userType = decoded.payload.type
    } else {
        userType = "guest"
    }



    try {
        investmentId = objectId(req.body.investmentId)
    } catch (e) {
        res.status(200).json({result: "no investment found"})
        return
    }

    try {
        const { db } = await connectToDatabase();
        investment = await db
            .collection("investments")
            .findOne({_id: investmentId})
        
        if (investment == null) {
            res.status(200).json({result: "no investment found"})
            return
        }

        deal = await db
            .collection("deals")
            .findOne({_id: objectId(investment.dealId)})

        sponsors = await db
            .collection("sponsors")
            .find()
            .project({firstName:1, lastName:1, email:1})
            .toArray()

        deal.sponsors = sponsors

        res.status(200).json({result: "success", deal, investment, userType})
        return
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
        return
    }
}