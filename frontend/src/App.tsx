import styled from "@emotion/styled";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { Dashboard } from "./dashboard";
import { Parametres } from "./parametres/Parametres";
import { AppTheme } from "./Theme";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "offres",
        element: <Box>Offres</Box>,
      },
      {
        path: "parametres",
        element: <Parametres />,
      },
      {
        path: "selection",
        element: <Box>Ma sélection</Box>,
      },
    ],
  },
]);
const MainBox = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

function Layout() {
  return (
    <AppTheme>
      <MainBox>
        <CssBaseline />
        <TopMenu />
        <Box component="main">
          <Toolbar />
          <Outlet />
        </Box>
      </MainBox>
    </AppTheme>
  );
}

export function App() {
  return <RouterProvider router={router} />;
}
