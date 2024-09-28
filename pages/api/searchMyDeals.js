require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {
    try {
        const secret = new TextEncoder().encode(process.env.JDUB)
        const token = req.cookies.auth
        const decoded = await jwtVerify(token, secret)
        const sponsorId = decoded.payload.id
        const dealsQuery = req.body.search != "" ?
        {$text: {$search: req.body.search}, sponsor:sponsorId} :
        {sponsor:sponsorId};
        const {db} = await connectToDatabase();
        
        const deals = await db
            .collection("deals")
            .find(dealsQuery)
            .toArray()

        const alertedDeals = await Promise.all(deals.map( async (deal) => {  
            deal.alert = false          
            let investments = await db
                .collection("investments")
                .find({
                    dealId: deal._id.toString()
                })
                .toArray()
            investments.map(investment => {
                if (investment.status == "Pending" || investment.status == "Documents Submitted" || investment.status == "Awaiting Payment") {
                    deal.alert = true
                }
            })
            return deal
        }))
        res.status(200).json({result: "success", deals: alertedDeals})
    } catch (e) {
        console.log(e)
        res.status(200).json({result: "error", message: e})
    }
}