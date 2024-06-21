import styled from "@emotion/styled";
import { Box, CssBaseline } from "@mui/material";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { AppTheme } from "./Theme";
import { Dashboard } from "./dashboard";
import { Offres } from "./offres";
import { Parametres } from "./parametres/Parametres";
import { Selection } from "./selection";
import { DeSelection } from "./selection/delete";

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
        path: "offres/:id?",
        element: <Offres />,
      },
      {
        path: "parametres",
        element: <Parametres />,
      },
      {
        path: "selection",
        element: <Selection />,
      },
      {
        path: "selection/remove/:id_offre",
        element: <DeSelection />,
      },
      {
        path: "*",
        element: <span>Cette page n'existe pas</span>
      },
    ],
  },
]);
const MainBox = styled(Box)`
  // display: flex;
  // flex-direction: column;
  // height: 100%;
`;

function Layout() {
  return (
    <AppTheme>
      <MainBox>
        <CssBaseline />
        {/* <TopMenu /> */}
        <Navbar />
        <Box component="main">
          {/* <Toolbar /> */}
          <Outlet />
        </Box>
      </MainBox>
    </AppTheme>
  );
}

export function App() {
  return <RouterProvider router={router} />;
}
