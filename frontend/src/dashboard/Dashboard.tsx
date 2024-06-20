import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Divider,
  LinearProgress,
  Stack
} from "@mui/material";

import React from "react";
import { authenticatedGet } from "../auth/helper";
import {JobsNear, AppliedOffers} from ".";

export function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [communes, setCommunes] = React.useState<any[] | null>([]);
  const [offersByCommune, setOffersByCommune] = React.useState<any[]>([]);
  const { user } = useAuth0();
  console.log(user);

  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        console.log(token);

        const queries = new URLSearchParams({
          email: user?.email || "",
        }).toString();
        const document = await authenticatedGet(
          token,
          "/v1/offre_poste?" + queries
        );
        const res = await authenticatedGet(
          token,
          "/v1/candidat-offres-communes?" + queries
        );

        const offersByCommune = await authenticatedGet(
          token,
          "/v1/commune-offers?" + queries
        );
        console.log(offersByCommune);
        setOffersByCommune(offersByCommune.data);

        setData(document.data);
        setCommunes(res.data);
        console.log(document);
        
        // const setteled = Promise.allSettled([])
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Stack sx={{ width: "100%", color: "grey.500" }} spacing={2}>
          <LinearProgress color="secondary" />
          <LinearProgress color="success" />
          <LinearProgress color="inherit" />
        </Stack>
      </div>
    );
  }
  return (
    <Box>
      {error ? (
        `Dashboard: response from API (with auth) ${error}`
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <AppliedOffers data={data} />
          <div style={{ paddingTop: "20px", paddingBottom: "20px" }}>
            <Divider />
          </div>
          <JobsNear offersByCommune={offersByCommune} />
        </div>
      )}
    </Box>
  );
}

// [
//   "candidat_id",
//   "offre_id",
//   "id",
//   "nom",
//   "prenom",
//   "telephone",
//   "email",
//   "pays",
//   "date_naissance",
//   "secteur_id",
//   "metier_id",
//   "titre_emploi",
//   "entreprise",
//   "lieu",
//   "description_courte",
//   "contrat",
//   "type_contrat",
//   "description",
//   "commune_id"
// ]
