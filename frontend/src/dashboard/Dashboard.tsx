import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";
import { authenticatedGet } from "../auth/helper";

export function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const document = await authenticatedGet(token, "/v1/offres");
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
        <ol>
          {data?.map((offre: any) => (
            <li key={offre.id}>{offre.titre_emploi}</li>
          ))}
        </ol>
      )}
    </Box>
  );
}
