require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import { jwtVerify } from 'jose';

export default async function createNewDeal(body, cookies) {
    
    
    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = cookies.auth
    const decoded = await jwtVerify(token, secret)
    const sponsorId = decoded.payload.id
    const {db} = await connectToDatabase();
    let sponsorContacts = body.sponsors

    if (!token) {
        return {result:"not authenticated", message:"not authenticated" }
    }
    
    try {
        const mainSponsor = await db
            .collection("sponsors")
            .findOne({_id: objectId(sponsorId)})

        const name = `${mainSponsor.firstName} ${mainSponsor.lastName}`
        const email = mainSponsor.email
        sponsorContacts.push([name, email])
       
    } catch (e) {
        console.log(e)
        return {result:"mainSponsorError"}
    }

    try {
        const createDeal = await db
        .collection("deals")
        .insertOne({
            nickname: body.nickname,
            minInvestment: body.minInvestment,
            maxInvestment: body.maxInvestment,
            projRoi: body.projRoi,
            investmentType: body.investmentType,
            lengthOfDeal: body.lengthOfDeal,
            sponsor: sponsorId,
            summary: body.summary,
            sponsors: sponsorContacts,
            status: "Active",
            purchasePrice: body.purchasePrice,
            totalRaise: body.totalRaise,
            city: body.city,
            state: body.state,
            distributionSchedule: body.distributionSchedule,
            raised:"$0",
            distributed: "$0"
        })

    return {result:"success", dealId: createDeal.insertedId} 
    } catch (e) {
        console.log(e)
        return {result:"writeDealError", message: e}
    }
}