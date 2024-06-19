import { useAuth0 } from "@auth0/auth0-react";
import {
  Box,
  Divider,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Stack,
} from "@mui/material";

import React from "react";
import { authenticatedGet } from "../auth/helper";

export function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [communes, setCommunes] = React.useState<any[] | null>(null);
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
<div style={{display: "flex", alignItems: "center",justifyContent: "center", height: "100vh"}}>
    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
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
      <div style={{display: "grid", gap: 10}}>
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingLeft: "25px",
          }}
        >
          {data?.map((element) => (
            <>
              <ListItem
                disablePadding
                sx={{ display: "flex", flexDirection: "column" }}
                alignItems={"flex-start"}
              >
                <ListItemText primary={element.entreprise}></ListItemText>
                <ListItemText primary={element.titre_emploi} />
                <ListItemText primary={element.description_courte} />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
        <Divider />
        <Divider />
        <Divider />
        <Divider />
        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            paddingLeft: "25px",
          }}
        >
          {offersByCommune?.map((element) => (
            <>
              <ListItem
                disablePadding
                sx={{ display: "flex", flexDirection: "column" }}
                alignItems={"flex-start"}
              >
                <ListItemText primary={element.entreprise}></ListItemText>
                <ListItemText primary={element.titre_emploi} />
                <ListItemText primary={element.description_courte} />
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </div>
      )}
      {JSON.stringify(communes)}
    </Box>
  );
}
