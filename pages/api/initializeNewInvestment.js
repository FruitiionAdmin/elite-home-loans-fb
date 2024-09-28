require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    let deal

    const secret = new TextEncoder().encode(process.env.JDUB)
    
    const token = req.cookies.auth
    const decoded = await jwtVerify(token, secret)

    const type = decoded.payload.type
    try {
        const { db } = await connectToDatabase();
        deal = await db
            .collection("deals")
            .findOne({_id: objectId(req.body.dealId)})

        if (deal) {
            const {distributionSchedule, minInvestment, maxInvestment} = deal

            res.status(200).json({result: "success", userType: type, distributionSchedule, minInvestment, maxInvestment})
            return
        } else {
            res.status(200).json({result: "no deal found"})
            return
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
        return
    }
    
}