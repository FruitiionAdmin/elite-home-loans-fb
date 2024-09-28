require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';

export default async (req, res) => {
    if (req.method === "POST") {
        console.log(req.body)
        try {
            const { db } = await connectToDatabase();
            //look for existing sponsor account
            const updateSponsor = await db
                .collection('investors')
                .updateOne(
                    {_id: objectId(req.body.id)},
                    {
                        "$set": {
                            frontId: req.body.frontId,
                            backId: req.body.backId,
                            selfie: req.body.selfie,
                            profilePicture: req.body.profilePicture,
                            w9: req.body.w9
                        }
                    },
                    {upsert:false}
                );
            res.status(200).json({result:"success"});    
        } catch (e) {
            console.log(e)
            res.status(500).json({error: 'write error'});
        }
    } else {
        res.status(405).json({error: 'Error'});
    }
}