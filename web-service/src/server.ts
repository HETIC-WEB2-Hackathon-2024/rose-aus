import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { getCandidats, updateCandidat, updateCommune} from "./database"; 
import dashboard from "./dashboard"
import { disSelectedOffre, getCandidatFromEmail, getFirstOffres,getSelectedOffres, isOffreSelectable, isOffreSelected, selecteOffre } from "./database";
import { getOffres, getOffresByTitle, getOffresBySearch } from "./database";

const port = 3000;
const app = express();
app.use(express.json());


// make sure we hare handling CORS properly
// See more on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use((req, res, next) => {
  // console.log(req)
  // console.log("stated");
  
  next()
}
)
app.use(
  cors({
    allowedHeaders: ["authorization", "Content-Type"], // you can change the headers
    exposedHeaders: ["authorization"], // you can change the headers
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false
  })
);
app.use(cors());
app.use(express.json());

const jwtCheck = auth({
  audience: "api.aus.floless.fr",
  issuerBaseURL: "https://adopte-un-stagiaire.eu.auth0.com/",
  tokenSigningAlg: "RS256",
});

// enforce that all incoming requests are authenticated
app.use(jwtCheck);


// Une petite approche pour éviter les doubles exécutions de script surtout celui d'ajout de la sélection. 
let isRunning = false;

app.get("/v1/offres", async function (_, res) {
  try {
    const offres = await getFirstOffres();
    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.use("/v1", dashboard)

app.get("/v1/candidats", async function (_, res) {
  try {
    const candidats = await getCandidats();
    res.send(candidats);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.get("/v2/offres", async function (_, res) {
  try {
    const offres = await getOffres();

    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});


app.post("/v1/candidat/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(`Received data for update: ${JSON.stringify(data)}`);
    await updateCommune(id, data);
    const updatedCandidat = await updateCandidat(id, data);
    console.log(`Updated candidat: ${JSON.stringify(updatedCandidat)}`);
    res.status(200).send(updatedCandidat);
  } catch (error) {
    console.error(`Error updating candidat: ${error}`);
  }
})




//Obtenir les offres sélectionnées
app.post("/v1/selections", async function (req, res) {
  try {
    const user = await getCandidatFromEmail(req.body.email.toString())
    const offres = await getSelectedOffres(user[0]['id']);
    res.send(offres);

} catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

//Ajouter une offre à la sélection
app.post("/v1/selection/add/:id_offre", async function (req, res) {
  try {
    const isOffreSelectable_ = (await isOffreSelectable(req.body.email,req.params.id_offre)).length > 0
    if (isOffreSelectable_) {
      const user = await getCandidatFromEmail(req.body.email.toString())
      const isOffreSelected_ = (await isOffreSelected(user[0]['id'],req.params.id_offre)).length > 0
      
      if (!isOffreSelected_) {
        if (isRunning) {
          return res.status(429).send({status : 429,msg : "Enregistrement en cours"});
        }

      isRunning = true;

      await selecteOffre(user[0]['id'],req.params.id_offre)
      res.status(201).send({status : 201,msg : "Offre selectionnée"});
      } else {
      res.status(200).send({status : 400,msg : "Cette offre est déjà selectionnée"});
      }
    } else {
      res.status(200).send({status : 400,msg : "Action impossible, informations erronées."});
    }
  } catch (error) {
    res.status(500).send({status:500, error: "Internal Server Error", reason: error,msg:"Offre non selectionnée, une erreur a survenu." });
  } finally {
    isRunning = false;
  }
});

//Supprimer une offre de la sélection
app.post("/v1/selection/remove/:id_offre", async function (req, res) {
  try {
      const user = await getCandidatFromEmail(req.body.email.toString())
      const isOffreSelected_ = (await isOffreSelected(user[0]['id'],req.params.id_offre)).length > 0
      
      if (isOffreSelected_) {        
        disSelectedOffre(user[0]['id'],req.params.id_offre)
        res.status(201).send({status : 201,msg : "Offre déselectionnée"});
      } else {
      res.status(200).send({status : 400,msg : "Cette offre n'existe pas dans la selection"});
      }
  } catch (error) {
    res.status(500).send({status:500, error: "Internal Server Error", reason: error,msg:"Offre non déselectionnée, une erreur a survenu." });
  }
});

app.post("/v1/selection/check/:id_offre", async function (req, res) {
  try {
      const user = await getCandidatFromEmail(req.body.email.toString())
      const isOffreSelected_ = (await isOffreSelected(user[0]['id'],req.params.id_offre)).length > 0
      
      res.status(200).send({status : 200,response : !isOffreSelected_});
      }
   catch (error) {
    res.status(500).send({status:500, error: "Internal Server Error", reason: error,response:false });

   }})
   
app.get("/v1/offres/search/global/:search", async function (req, res) {
  try {
    const offres = await getOffresBySearch(req.params.search);
    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.get("/v1/offres/search/title/:search", async function (req, res) {
  try {
    const offres = await getOffresByTitle(req.params.search);
    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.use("/v1", dashboard)

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}  - pid: ${process.pid}`);
});
