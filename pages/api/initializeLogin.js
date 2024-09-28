require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';
import { jwtVerify } from 'jose';

export default async (req, res) => {

    const secret = new TextEncoder().encode(process.env.JDUB)
    const token = req.cookies.auth
    let decoded
    let userType

    const {db} = await connectToDatabase()

    if (token) {
        
        try {
            decoded = await jwtVerify(token, secret)
            userType = decoded.payload.type
        } catch (e) {
            res.status(200).json({result:'invalid'})
            return
        }
    } 



    res.status(200).json({result:'success', userType})

    
}