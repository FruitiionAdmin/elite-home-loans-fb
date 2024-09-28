import createInvestor from "../../functions/createInvestor";

export default async (req, res) => {
    if (req.method === "POST") {
        let result = await createInvestor(req.body)
        res.status(200).json(result)
    } else {
        res.status(405).json({error: 'Error'});
    }
}