import React from "react";
import SideBar from "../../component/sideBar/SideBar";
import { Box, Button, Grid, Link } from "@mui/material";
import { useAuth } from "../../component/context/authContext";
import { Outlet, useNavigate } from "react-router";

export default function Home() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigateToSuggestion = () => {
    navigate("/suggestion");
  };

  const handleReceiveRequest = () => {
    navigate("/receiveRequest");
  };

  return (
    <Grid container>
      <Grid item xs={3}>
        <SideBar />
      </Grid>
      <Grid item xs={9}>
        <Box display="flex" justifyContent="flex-end" p={2}>
          {/* <Link
            variant="outline"
            underline="none"
            component="button"
            href="/suggestion"
            background="primary"
          >
            suggestion
          </Link> */}
          <Button
            variant="contained"
            color="primary"
            p={2}
            onClick={handleReceiveRequest}
          >
            friend request
          </Button>
          <Button onClick={handleNavigateToSuggestion}>Suggestion</Button>

          <Button variant="contained" color="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
        <Outlet /> {/* Ensure Outlet is here to render nested routes */}
      </Grid>
    </Grid>
  );
}
