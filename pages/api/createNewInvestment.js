import createNewInvestment from "../../functions/createNewInvestment";

export default async (req, res) => {
    if (req.method === "POST") {
        let result = await createNewInvestment(req.body, req.cookies)
        res.status(200).json(result)
    } else {
        res.status(405).json({error: 'Error'});
    }
}