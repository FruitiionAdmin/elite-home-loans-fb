require('dotenv').config();
import { connectToDatabase, objectId } from '../database';
import salt from './salt';

export default async function  createSponsor(body) {
    try {
        const { db } = await connectToDatabase();
        //look for existing sponsor account
        const sponsorCheck = await db
            .collection('sponsors')
            .findOne({
                email: body.email,
                status: "Invited"
            });
        if (sponsorCheck == null) {
            return {result:'success', message: 'Invitation does not exist'}
        }
        //write text info to db
        const sponsor = await db
            .collection('sponsors')
            .findOneAndUpdate(
                {
                    _id:objectId(sponsorCheck._id)
                },
                {
                    "$set": {
                        firstName: body.firstName,
                        lastName: body.lastName,
                        middleInitial: body.middleInitial,
                        suffix: body.suffix,
                        email: body.email,
                        password: salt(body.email,body.password),
                        about: body.experience,
                        status: "Pending",
                        phoneNumber: body.phoneNumber                    }
                    
                },
                {
                    upsert: false,
                }
        )
        return {result:"success", sponsorId: sponsorCheck._id}   
    } catch (e) {
        return {result:"error", message: e}
    }
}