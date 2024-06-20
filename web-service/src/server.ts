import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { getFirstOffres, getCandidats, updateCandidat } from "./database";
import dashboard from "./dashboard"
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

const jwtCheck = auth({
  audience: "api.aus.floless.fr",
  issuerBaseURL: "https://adopte-un-stagiaire.eu.auth0.com/",
  tokenSigningAlg: "RS256",
});

// enforce that all incoming requests are authenticated
app.use(jwtCheck);

app.get("/v1/offres", async function (_, res) {
  try {
    const offres = await getFirstOffres();
    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.get("/v1/candidats", async function (_, res) {
  try {
    const candidats = await getCandidats();
    res.send(candidats);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.post("/v1/candidat/:id", async function (req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    console.log(`Received data for update: ${JSON.stringify(data)}`);
    const updatedCandidat = await updateCandidat(id, data);
    console.log(`Updated candidat: ${JSON.stringify(updatedCandidat)}`);
    res.status(200).send(updatedCandidat);
  } catch (error) {
    console.error(`Error updating candidat: ${error}`);
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

app.use("/v1", dashboard)
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}  - pid: ${process.pid}`);
});
