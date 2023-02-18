import React from "react";

import Button from "@mui/material/Button";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

import GoogleButtonStyling from "./GoogleButtonStyling";

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
        sx={GoogleButtonStyling}
        onClick={signOutUser}
      >
        Sign out
      </Button>
    </>
  );
}

export default GoogleSignOutButton;
