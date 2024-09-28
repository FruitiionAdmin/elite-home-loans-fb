require('dotenv').config();
import { connectToDatabase, objectId } from '../../database';

export default async (req, res) => {
    try {
        const offeringsQuery = req.body.search != "" ?
        {$text: {$search: req.body.search}, status: 'Active'} :
        {status: 'Active'};
        const {db} = await connectToDatabase();
        
        const deals = await db
            .collection("deals")
            .find(offeringsQuery)
            .toArray()
        res.status(200).json({result: "success", deals})
    } catch (e) {
        console.log(e)
        res.status(200).json({result: "error", message: e})
    }
}