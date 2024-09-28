require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';
import addArrayOfDollarAmounts from '../../functions/addArrayOfDollarAmounts';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
    let userType
    let userId

    const {dealId} = req.body
    console.log(dealId)
    const {db} = await connectToDatabase()
    try {
        decoded = await jwtVerify(token, secret) 
        userType = decoded.payload.type
        userId = decoded.payload.id
    } catch (e) {
        
        userType = "guest"
        res.status(200).json({result:"guest"})
        return
    }

    try {
        const deal = await db
            .collection("deals")
            .findOne({_id: objectId(dealId)})
        
        if (deal == null) {
            res.status(200).json({result:"no deal found"})
            return
        }

        if ( userId == deal.sponsor) {
            res.status(200).json({result:"success"})
            return
        }
    } catch (e) {
        console.log(e)
        res.status(200).json({result:"search Error"})
        return
    }



    res.status(200).json({result:'done', userType})

    
}