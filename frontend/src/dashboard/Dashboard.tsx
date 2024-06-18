import { useAuth0 } from "@auth0/auth0-react";
import { Box, Divider, List, ListItem, ListItemText } from "@mui/material";

import React from "react";
import { authenticatedGet } from "../auth/helper";

export function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const {user} = useAuth0()
  console.log(user);
  
  

  
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        console.log(token);
        
        const document = await authenticatedGet(token, "/v1/offre_poste?" + new URLSearchParams({
          email: user?.email || ""
          }).toString() as string)
        setData(document.data);
        console.log(document);
        
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, []);

  return loading ? (
    <Box>chargement...</Box>
  ) : (
    <Box>
      {error ? (
        `Dashboard: response from API (with auth) ${error}`
      ) : (
        <List sx={{display:"flex",flexDirection:"column",gap:"1rem",paddingLeft:"25px"}}>
          { data?.map(element => (
            <>
              <ListItem disablePadding sx={{display:"flex",flexDirection:"column"}}   alignItems={"flex-start"}>
                  <ListItemText primary={element.entreprise}></ListItemText>
                  <ListItemText primary={element.titre_emploi} />
                  <ListItemText primary={element.description_courte} />
              </ListItem>
              <Divider/>
            </>
        ))}
        </List>
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