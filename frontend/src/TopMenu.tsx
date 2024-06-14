import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Profile } from "./auth/Profile";

interface MenuItemProps {
  id: string;
  title: string;
}

const MenuButton = styled(Button)<{ active?: boolean }>(
  ({ theme, active }) => ({
    marginLeft: theme.spacing(1),
    background: active ? theme.palette.common.white : "transparent",
    color: active ? theme.palette.common.black : theme.palette.common.white,
    ":hover": {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
  })
);

const MenuToolbar = styled(Toolbar)({
  justifyContent: "space-between",
});

export function TopMenu() {
  const menuItems: MenuItemProps[] = [
    {
      id: "dashboard",
      title: "Dashboard",
    },
    {
      id: "offres",
      title: "Offers",
    },
    {
      id: "parametres",
      title: "Paramètres",
    },
    {
      id: "entreprises",
      title: "Entreprises",
    },
    {
      id: "notification",
      title: "Notification",
    },
  ];
  const navigate = useNavigate();
  function onMenuItemClick(id: string) {
    navigate("/" + id);
  }
  return (
    <AppBar component="nav">
      <MenuToolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">AuS</Typography>
        <Box>
          {menuItems.map((item) => (
            <MenuButton onClick={() => onMenuItemClick(item.id)} key={item.id}>
              {item.title}
            </MenuButton>
          ))}
        </Box>
        <Profile />
      </MenuToolbar>
    </AppBar>
  );
}
