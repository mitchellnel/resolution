import React from "react";

import Button from "@mui/material/Button";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

interface GoogleSignOutButtonProps {
  setAuthenticatedFlag: (flagState: boolean) => void;
}

function GoogleSignOutButton({
  setAuthenticatedFlag,
}: GoogleSignOutButtonProps) {
  async function signOutUser() {
    setAuthenticatedFlag(false);

    await signOut(auth);
  }

  return (
    <>
      <Button
        variant="contained"
        size="large"
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
        onClick={signOutUser}
      >
        Sign out
      </Button>
    </>
  );
}

export default GoogleSignOutButton;
