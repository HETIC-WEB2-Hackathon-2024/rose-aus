import  express from "express";
import { findOffersByCommune, findUserByEmail, findUserCommune, getCandidateAppliedOffers } from "./database";
const router = express.Router()
router.get("/offre_poste", async (req,res,next) => {
    if (!req.query.email) 
        return res.send("email invalid")
    try {
        const id = await findUserByEmail(req.query.email.toString())
        const data = await getCandidateAppliedOffers(id)
        res.status(200).json({data})
    } catch (error) {
        console.error(error);
        res.json({success: false, error: (error as string).toString()})
    }
    
})


router.get("/candidat-offres-communes", async (req,res,next) => {
    if (!req.query.email) 
        return res.send("email invalid")

    try {
        const id = await findUserByEmail(req.query.email.toString())
        const data = await findUserCommune(id)
        res.status(200).json({data})
    } catch (error) {
        console.error({success: false, error});
        res.json({success: false, error: (error as string).toString()})
    }
})

router.get("/commune-offers", async (req,res,next) => {
    console.log(req.query, "hey");
    if (!req.query.email) 
        return res.send("email invalid")

    try {
        const id = await findUserByEmail(req.query.email.toString())
        const commune = await findUserCommune(id)
        const data = await findOffersByCommune(commune.id)
        res.status(200).json({data})
    } catch (error) {
        console.error({success: false, error});
        res.json({success: false, error: (error as string).toString()})
    }
})

export default router