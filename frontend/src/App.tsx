import styled from "@emotion/styled";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { Dashboard } from "./dashboard";
import { AppTheme } from "./Theme";
import { AddSelection } from "./selection/add";
import { DeSelection } from "./selection/delete";
import { Selection } from "./selection";
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
        element: <Box>Paramètres</Box>,
      },
      {
        path: "selection",
        element: <Selection />,
      },
      {
        path: "selection/add/:id_offre",
        element: <AddSelection />,
      },
      {
        path: "selection/remove/:id_offre",
        element: <DeSelection />,
      }
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
