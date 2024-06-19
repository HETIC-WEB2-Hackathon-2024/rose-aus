import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";
import { authenticatedGet } from "../auth/helper";

export function Parametres() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, "/v1/candidats");
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
        `Parametres: response from API (with auth) ${error}`
      ) : (
        <div>
          {data?.map((candidat: any) => (
            <div key={candidat.id}>
              <h3>{candidat.pays}</h3>
            </div>
          ))}
        </div>
      )}
    </Box>
  );
}

export default Parametres;
