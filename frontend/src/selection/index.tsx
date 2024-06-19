import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import WorkIcon from '@mui/icons-material/Work';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { authenticatedGet,authenticatedPost } from "../auth/helper";

export function Selection() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { user} = useAuth0();

  function selectUrlReturner(id_offre :number) {
    return `/selection/add/${id_offre}`
  }

  function deselectUrlReturner(id_offre :number) {
    return `/selection/remove/${id_offre}`
  }

  function dateFormater (date_origin :Date) {

const date = new Date(date_origin);

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); 
const day = String(date.getDate()).padStart(2, '0');


// Formatage de la date en Y-m-d
return `${year}-${month}-${day}`;
  }
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedPost(token, `/v1/selections`,{email : user?.email});        
        setData(document);
      } catch (error) {
        setError(`Error from web service: ${error}`);
      } finally {
        setLoading(false);
      }
    }
    
    callApi();
  }, []);

  return loading ? (
    <Box>chargement des offres selectionnées</Box>
  ) : (
    <Box>
      {error ? (
        `Dashboard: response from API (with auth) ${error}`
      ) : (
        <List>
          {data?.map((offre: any) => (
            <ListItem key={offre.id}></ListItem>
          ))}
          <List
      sx={{ width: '100%', bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          Vos offres selectionnées
        </ListSubheader>
      }
    >
        {data?.map((offre: any) => (
            <div>

            <ListItem alignItems="flex-start" key={offre.id}>
                <ListItemIcon>
                    <WorkIcon />
                </ListItemIcon>
              <ListItemText
                primary={offre.titre_emploi}
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {offre.contrat} à {offre.lieu.replace(/.* - /,'')} 
                    </Typography> &nbsp;| &nbsp;
                    { offre.description_courte}
                    <br />
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.secondary"
                    >
                       Enregistré le {dateFormater(offre.date_ajout)}
                        </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            <a href={selectUrlReturner(offre.id)}>
                <Fab aria-label="like">
                    <FavoriteIcon />
                </Fab>
            </a>
            <a href={deselectUrlReturner(offre.id)}>
                <Fab disabled aria-label="like">
                    <FavoriteIcon />
                </Fab>
            </a>
            <Divider variant="inset" component="li" />
            </div>
          ))}
    </List>
        </List>
      )}
    </Box>
  );
}
