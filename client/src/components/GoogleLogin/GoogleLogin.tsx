import React, { useState } from "react";

import Button from "@mui/material/Button";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";
import { ReactComponent as GoogleLogoWhite } from "../../assets/google_logo_white.svg";

function GoogleLogin() {
  const [buttonMouseover, setButtonMouseover] = useState<Boolean>(false);

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={buttonMouseover ? <GoogleLogoWhite /> : <GoogleLogo />}
        sx={{
          backgroundColor: "#f8f8f8",
          color: "#5485eb",
          fontWeight: 800,
          fontSize: "1.2rem",
          paddingBottom: "15px",
          paddingTop: "15px",
          "&:hover": {
            backgroundColor: "#5485eb",
            color: "#f8f8f8",
          },
        }}
        onMouseOver={() => setButtonMouseover(true)}
        onMouseOut={() => setButtonMouseover(false)}
      >
        Sign in with Google
      </Button>
    </>
  );
}

export default GoogleLogin;
