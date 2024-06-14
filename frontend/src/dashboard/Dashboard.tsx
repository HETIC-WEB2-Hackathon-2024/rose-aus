import { useAuth0 } from "@auth0/auth0-react";
import { Box } from "@mui/material";
import React from "react";

export function Dashboard() {
  const { getAccessTokenSilently } = useAuth0();
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<string | null>(null);
  React.useEffect(() => {
    async function callApi() {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch("http://localhost:3000/authorized", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const document = await response.text();
        setData(document);
      } catch (error) {
        console.error(error);
        setData("Error: " + error);
      } finally {
        setLoading(false);
      }
    }
    callApi();
  }, []);

  return loading ? (
    <Box>chargement...</Box>
  ) : (
    <Box>{`Dashboard: response from API (with auth) ${data}`}</Box>
  );
}
