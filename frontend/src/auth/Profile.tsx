import { useAuth0 } from "@auth0/auth0-react";
import {
  Avatar,
  Button,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Popover,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";

function getInitialFromUserName(name: string) {
  const words = name.split(" ");
  if (words.length === 1) {
    return `${name[0]}${name[1]}`;
  } else {
    return `${words[0][0]}${words[1][0]}`;
  }
}

export function Profile() {
  const { user, logout } = useAuth0();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const popoverIsOpen = Boolean(anchorEl);
  const name = user?.name || "Anonymous";

  return (
    <div>
      <Button onClick={handleClick}>
        <Avatar>{getInitialFromUserName(name)}</Avatar>
      </Button>
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        onClose={handleClose}
        open={popoverIsOpen}
      >
        <List
          sx={{ bgcolor: "background.paper" }}
          subheader={<ListSubheader>{name}</ListSubheader>}
        >
          <ListItemButton onClick={() => logout()}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Déconnexion" />
          </ListItemButton>
        </List>
      </Popover>
    </div>
  );
}
