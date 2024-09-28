require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {
    let investments
    let completeInvestments
    const secret = new TextEncoder().encode(process.env.JDUB)
    
    const token = req.cookies.auth
    const decoded = await jwtVerify(token, secret)
    //getId
    const id = decoded.payload.id
    const type = decoded.payload.type
    //getInvestments
    try {
        const { db } = await connectToDatabase();
        investments = await db
            .collection("investments")
            .find({investor: id})
            .toArray()
        
        completeInvestments = await Promise.all( investments.map( async (investment) => {
            const deal = await db
                .collection("deals")
                .findOne({_id: objectId(investment.dealId)})
            investment.title = deal.nickname
            investment.image = deal.images[0]
            investment.type = deal.investmentType
            return investment
        }))
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
    }
    
    //respond with type and investments
    res.status(200).json({result: "success", userType: type, investments: completeInvestments})
}