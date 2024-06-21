import AdbIcon from "@mui/icons-material/Adb";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem, { MenuItemProps } from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useNavigate } from "react-router";
import { Profile } from "./auth/Profile";
import { SvgIcon } from "@mui/material";

// const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
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
    id: "selection",
    title: "Ma sélection",
  },
];

function AppIcon() {
  return (
  <SvgIcon style={{paddingRight: "10px",width:"100px"} } ><svg version="1.0" xmlns="http://www.w3.org/2000/svg"
    width="500px" height="500px" viewBox="0 0 626.000000 501.000000"
    preserveAspectRatio="xMidYMid meet">
   
   <g transform="translate(0.000000,501.000000) scale(0.100000,-0.100000)"
   fill="#000000" stroke="none">
   <path d="M2707 4279 c-62 -15 -137 -58 -195 -113 -122 -114 -186 -260 -212
   -481 -5 -49 -13 -107 -16 -127 l-6 -37 -496 -3 c-487 -3 -498 -3 -537 -25 -47
   -25 -85 -64 -111 -113 -18 -34 -19 -84 -19 -1255 l0 -1220 27 -47 c16 -25 45
   -60 65 -77 79 -66 -54 -62 1938 -59 l1810 3 41 22 c56 30 103 79 128 133 21
   45 21 52 24 1234 3 1323 6 1258 -63 1329 -71 73 -54 71 -605 77 l-494 5 -13
   100 c-7 55 -19 135 -28 179 -43 214 -152 370 -314 449 l-66 32 -410 2 c-225 1
   -427 -3 -448 -8z m841 -195 c146 -73 216 -214 238 -476 l7 -88 -665 0 -664 0
   17 123 c9 67 22 142 29 167 30 110 111 217 205 271 l50 29 366 0 365 0 52 -26z
   m-2188 -1880 l5 -1121 28 -36 c16 -21 46 -46 67 -57 39 -20 61 -20 1670 -20
   1362 0 1636 2 1663 14 39 16 82 61 96 99 8 19 11 378 11 1138 l0 1110 33 -3
   32 -3 3 -1124 c1 -759 -1 -1136 -8 -1162 -6 -22 -24 -55 -41 -73 -62 -72 73
   -67 -1810 -64 l-1695 3 -41 27 c-24 16 -49 44 -62 70 l-21 44 0 1143 0 1142
   33 -3 32 -3 5 -1121z m3480 831 l0 -295 -736 2 -737 3 -11 46 c-16 63 -49 105
   -109 139 -65 37 -155 42 -216 10 -55 -27 -107 -93 -122 -151 l-13 -49 -738 0
   -738 0 0 295 0 295 1710 0 1710 0 0 -295z m-1658 -262 c40 -36 8 -113 -47
   -113 -54 0 -85 71 -48 112 20 22 70 23 95 1z m-296 -91 c6 -4 20 -27 31 -52
   40 -91 115 -140 212 -140 106 0 183 50 222 145 l22 54 734 1 733 0 0 -785 c0
   -863 2 -828 -60 -860 -26 -13 -220 -15 -1645 -15 -1742 0 -1661 -2 -1699 51
   -14 21 -16 99 -16 816 l0 793 728 0 c400 0 732 -4 738 -8z"/>
   </g>
   </svg>
   </SvgIcon>)
}

function Navbar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const navigate = useNavigate();
  function onMenuItemClick(id: string) {
    handleCloseNavMenu();
    navigate("/" + id);
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };


  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AppIcon />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              ":hover": { color: "white" },
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            ROSE
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {menuItems.map((item: any) => (
                <MenuItem
                  onClick={() => onMenuItemClick(item.id)}
                  key={item.id}
                >
                  <Typography textAlign="center">{item.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            LOGO
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {menuItems.map((item: any) => (
              <Button
                key={item.id}
                onClick={() => onMenuItemClick(item?.id)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {item.title}
              </Button>
            ))}
          </Box>
          <Profile />
          {/* <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
            <Profile />
               {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))} 
            </Menu>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
