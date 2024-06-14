import express from "express";
import { auth } from "express-oauth2-jwt-bearer";
import cors from "cors";

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

app.get("/authorized", function (_, res) {
  res.send("Secured Resource");
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
