import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { getFirstOffres } from "./database";
import dashboard from "./dashboard"
import { getOffres, getOffresByTitle, getOffresBySearch } from "./database";
const port = 3000;
const app = express();

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
app.use("/v1", dashboard)

app.get("/v2/offres", async function (_, res) {
  try {
    const offres = await getOffres();
    res.send(offres);
  } catch (error) {
    res.status(500).send({ error: "Internal Server Error", reason: error });
  }
});

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

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}  - pid: ${process.pid}`);
});
