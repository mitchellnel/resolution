import React from "react";

import Button from "@mui/material/Button";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";

function GoogleLogin() {
  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={<GoogleLogo />}
        sx={{
          backgroundColor: "#f8f8f8",
          color: "#5485eb",
          fontWeight: 800,
          fontSize: "1.2rem",
          paddingBottom: "15px",
          paddingTop: "15px",
        }}
      >
        Sign in with Google
      </Button>
    </>
  );
}

export default GoogleLogin;
