require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth

    const {investmentId} = req.body

    
    let decoded
    let userType
    let userId

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
        const investment = await db
            .collection("investments")
            .findOne({_id: objectId(investmentId)})
        
        if (investment == null) {
            res.status(200).json({result:"no investment found"})
            return
        }

        if ( userId == investment.investor) {
            res.status(200).json({result:"success"})
            return
        }
    } catch (e) {
        console.log(e)
        res.status(200).json({result:"search Error"})
        return
    }

    res.status(200).json({result:"done"})
    return
   
}