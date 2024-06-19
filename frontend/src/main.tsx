import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { StyledEngineProvider } from '@mui/material/styles';
import { Auth0Provider } from "@auth0/auth0-react";
import { Authenticated } from "./auth/Authenticated.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Auth0Provider
      domain="adopte-un-stagiaire.eu.auth0.com"
      clientId="R5nkYZygAqAtORqxqqpUPf03vuBAO7Xt"
      authorizationParams={{
        audience: "api.aus.floless.fr",
        redirect_uri: window.location.origin,
      }}
    >
      <Authenticated>
        <StyledEngineProvider injectFirst>
          <App />
        </StyledEngineProvider>
      </Authenticated>
    </Auth0Provider>
  </React.StrictMode>
);
