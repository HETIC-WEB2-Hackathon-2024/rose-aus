import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";
import { getFirstOffres, getOffres, getOffresByTitle, getOffresBySearch, getTotalOffresCount } from "./database";

const port = 3000;
const app = express();

// make sure we hare handling CORS properly
// See more on CORS: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use(cors());

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

app.get("/v2/offres", async function (req, res) {
  try {
    const { limit = 30, offset = 0 } = req.query;
    const offres = await getOffres(parseInt(limit as string), parseInt(offset as string));
    const total = await getTotalOffresCount();
    res.send({ offres, total: total[0].count });
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
  console.log(`Server started on http://localhost:${port}`);
});