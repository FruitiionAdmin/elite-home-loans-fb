import createSponsor from "../../functions/createSponsor";

export default async (req, res) => {
    if (req.method === "POST") {
        let result = await createSponsor(req.body)
        res.status(200).json(result)
    } else {
        res.status(405).json({error: 'Error'});
    }
}