require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
        
    let deal
    let userType
    let dealId

    let sponsors


    const { db } = await connectToDatabase();

    try {
        decoded = await jwtVerify(token, secret)
        userType = decoded.payload.type
    } catch (e) {
        userType = "guest"
    }


    try {
        dealId = objectId(req.body.dealId)
    } catch (e) {
        res.status(200).json({result: "no deal found"})
        return
    }

    try {
        sponsors = await db
            .collection("sponsors")
            .find()
            .toArray()
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
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
        deal.sponsors = sponsors
        res.status(200).json({result: "success", deal, userType})
        return
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
        return
    }
}