require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const { db } = await connectToDatabase();
            const updateSponsor = await db
                .collection('deals')
                .updateOne(
                    {_id: objectId(req.body.dealId)},
                    {
                        "$set": {
                            documents: req.body.documents,
                            images: req.body.images
                        }
                    },
                    {upsert:true}
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