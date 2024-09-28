import createNewDeal from "../../functions/createNewDeal";

export default async (req, res) => {
    if (req.method === "POST") {
        let result = await createNewDeal(req.body, req.cookies)
        res.status(200).json(result)
    } else {
        res.status(405).json({error: 'Error'});
    }
}