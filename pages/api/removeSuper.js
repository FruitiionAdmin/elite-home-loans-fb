require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';

export default async (req, res) => {
    if (req.method === "POST") {
        try {
            const { db } = await connectToDatabase();
            //look for existing sponsor account

            const checkSponsor = await db
                .collection('sponsors')
                .findOne({_id: objectId(req.body.id)})

            if (checkSponsor.owner) {
                res.status(200).json({result:"success", error: "cannot deactivate owner"});
                return
            }


            const updateSponsor = await db
                .collection('sponsors')
                .updateOne(
                    {_id: objectId(req.body.id)},
                    {
                        "$set": {
                            superUser: false
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
    return
}