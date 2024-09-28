require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    let offerings
    let funded
    let samples
    const secret = new TextEncoder().encode(process.env.JDUB)
    
    const token = req.cookies.auth
    const decoded = await jwtVerify(token, secret)
    //getType
    const type = decoded.payload.type
    //getOfferings
    try {
        const { db } = await connectToDatabase();
        offerings = await db
            .collection("deals")
            .find({status: "Active"})
            .limit(30)
            .toArray()

       
    } catch (e) {
        console.log(e)
        res.status(500).json({result: "error"})
    }
    
    //respond with type and offerings
    res.status(200).json({result: "succes", userType: type, offerings, funded, samples})
}