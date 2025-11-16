import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../ThemeContext";

export default function Navbar() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { darkMode, toggleTheme } = useThemeContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
    nav("/login");
  };

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: darkMode ? "#333" : "#6B46C1", // use theme context
        color: "#fff",
        boxShadow: "0 2px 15px rgba(207, 236, 43, 0.15)",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Subscription Dashboard
        </Typography>

        <Button
          color="inherit"
          sx={{ mx: "5px" }}
          onClick={() => nav("/plans")}
        >
          Plans
        </Button>

        {auth.user ? (
          <>
            <Button
              color="inherit"
              sx={{ mx: "5px" }}
              onClick={() => nav("/dashboard")}
            >
              My Plan
            </Button>
            {auth.user.role === "admin" && (
              <Button
                color="inherit"
                sx={{ mx: "5px" }}
                onClick={() => nav("/admin/subscriptions")}
              >
                Admin
              </Button>
            )}

            {/* Theme toggle */}
            <IconButton color="inherit" sx={{ ml: 1 }} onClick={toggleTheme}>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            {/* Avatar */}
            <Box sx={{ ml: 2 }}>
              <Avatar
                sx={{ bgcolor: "#FFB74D", cursor: "pointer" }}
                onClick={handleMenuOpen}
              >
                {getInitials(auth.user.name)}
              </Avatar>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem disabled>{auth.user.name}</MenuItem>
              <MenuItem
                onClick={() => {
                  handleMenuClose();
                  nav("/dashboard");
                }}
              >
                My Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => nav("/login")}>
              Login
            </Button>
            <Button color="inherit" onClick={() => nav("/register")}>
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
