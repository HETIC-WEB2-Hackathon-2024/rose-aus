import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Stack, LinearProgress } from "@mui/material";

/**
 * Makes sure user is authenticated before rendering children.
 *
 * If user is not authenticated, it will be redirected to login page provided
 * by Auth0.
 *
 */
export function Authenticated({ children }: React.PropsWithChildren) {
  const { loginWithRedirect, user, isLoading, error } = useAuth0();
  React.useEffect(() => {
    if (error) {
      return;
    } else if (!user && !isLoading) loginWithRedirect();
  }, [user, isLoading, loginWithRedirect, error]);

  if (error) return <div>Oops... {error.message}</div>;
  return isLoading ? <div style={{display: "flex", alignItems: "center",justifyContent: "center", height: "100vh"}}>
    <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={2}>
      <LinearProgress color="secondary" />
      <LinearProgress color="success" />
      <LinearProgress color="inherit" />
    </Stack>

  </div> : <>{children}</>;
}
