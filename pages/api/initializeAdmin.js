require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';
import addArrayOfDollarAmounts from '../../functions/addArrayOfDollarAmounts';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    
    let decoded

    let sponsors
    let investors
        
    let assetsUnderManagement
    let totalRaised

    let user

    if (token) {
        decoded = await jwtVerify(token, secret)
        if (decoded.payload.type != "sponsor") {
            res.status(200).json({result:"unauthorized"})
            return
        }
    } else {
        res.status(200).json({result:"unauthorized"})
        return
    }

    const {db} = await connectToDatabase()

    //getSponsors
    //getInvestors
    //calcAsseteUnderManagment
    //calcTotalRaised

    try {
        user = await db
            .collection("sponsors")
            .findOne({_id: objectId(decoded.payload.id)})
    } catch (e) {
        res.status(200).json({result:"user profile error"})
        return
    }

    try {
        sponsors = await db
            .collection("sponsors")
            .find()
            .toArray()
    } catch (e) {
        console.log(e)
        res.status(200).json({result:"sponsor error"})
        return
    }

    try {
        investors = await db
            .collection("investors")
            .find()
            .toArray()
    } catch (e) {
        console.log(e)
        res.status(200).json({result:"investor error"})
        return
    }

    try {
        let deals = await db
            .collection('deals')
            .find()
            .toArray()

        const totalRaiseArray = deals.map( deal => {
            if (deal.status == "Active" || deal.status == "Funded")
            return deal.totalRaise
        })
        assetsUnderManagement = addArrayOfDollarAmounts(totalRaiseArray)
        const raisedArray = deals.map( deal => {
            return deal.raised
        })
        totalRaised = addArrayOfDollarAmounts(raisedArray)

        
    } catch (e) {

    }

    
    res.status(200).json({result:"success", sponsors, investors, assetsUnderManagement, totalRaised, user})
    return
    

    
}