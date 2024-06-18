import  express, { query }  from "express";
import { findUserByEmail, getCandidateAppliedOffers } from "./database";
const router = express.Router()
router.get("/offre_poste", async (req,res,next) => {
    console.log(req.query);
    if (!req.query.email) {
        return res.send("email invalid")
    }
    try {
        const id = await findUserByEmail(req.query.email.toString())
        const data = await getCandidateAppliedOffers(id)
        res.status(200).json({data})
    } catch (error) {
        console.log(error);
        res.send("ERROR")
    }
    
})
export default router