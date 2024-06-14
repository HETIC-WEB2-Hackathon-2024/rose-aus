import styled from "@emotion/styled";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { TopMenu } from "./TopMenu";
import { Dashboard } from "./dashboard/Dashboard";

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
        path: "entreprises",
        element: <Box>Entreprises</Box>,
      },
      {
        path: "notification",
        element: <Box>Notification</Box>,
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
    <MainBox>
      <CssBaseline />
      <TopMenu />
      <Box component="main">
        <Toolbar />
        <Outlet />
      </Box>
    </MainBox>
  );
}

export function App() {
  return <RouterProvider router={router} />;
}
