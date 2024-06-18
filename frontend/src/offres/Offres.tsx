import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";
import { authenticatedGet } from "../auth/helper";
import "./index.css"
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

export function Offres() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, "/v2/offres");
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
    <Box>chargement...</Box>
  ) : (
    <Box>
      {error ? (
        `Dashboard: response from API (with auth) ${error}`
      ) : (
        <div className="card-wrapper">
          {data?.map((offre: any) => (
            <div key={offre.id} className="card">
              <Card>
                <CardContent>
                  <div className="card-content">
                    <h3>{offre.titre_emploi}</h3>
                    <div className="infos">
                      <span>{offre.contrat}&nbsp;-&nbsp;{offre.type_contrat}</span>
                      <span>{offre.lieu}</span>
                    </div>
                    <p>{offre.description_courte}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}