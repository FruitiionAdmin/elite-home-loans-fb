require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';
import addArrayOfDollarAmounts from '../../functions/addArrayOfDollarAmounts';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
        
    let deals
    let investments
    let user
    let userType
    let assetsUnderManagement
    let totalRaised
    let invested

    const {db} = await connectToDatabase()

    if (token) {
        decoded = await jwtVerify(token, secret)
        userType = decoded.payload.type
    } else {
        userType = "guest"
    }
    

    if (userType == "sponsor") {
        try {
            user = await db
                .collection("sponsors")
                .findOne({_id: objectId(decoded.payload.id)})
        } catch (e) {
            console.log(e)
            res.status(200).json({result:"sponsor error"})
            return
        }
        
        try {
            deals = await db
                .collection("deals")
                .find({sponsor: decoded.payload.id})
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
            console.log(e)
            res.status(200).json({result:"sponsor metric error"})
            return
        }
        res.status(200).json({result:"success", assetsUnderManagement, totalRaised, userType, user})
    } else {
        try {
            user = await db
                .collection("investors")
                .findOne({_id: objectId(decoded.payload.id)})
        } catch (e) {
            console.log(e)
            res.status(200).json({result:"investor error"})
            return
        }

        try {
            investments = await db
                .collection("investments")
                .find({investor: decoded.payload.id, status:"Active"})
                .toArray()
            let investedArray = investments.map( investment => {
                return investment.investmentAmount
            })
            invested = addArrayOfDollarAmounts(investedArray)
        } catch (e) {
            console.log(e)
            res.status(200).json({result:"investor metric error"})
            return
        }
        res.status(200).json({result:"success", invested, userType, user})
    }



    
}