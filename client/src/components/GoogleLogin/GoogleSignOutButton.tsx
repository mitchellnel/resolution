import Button from "@mui/material/Button";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../../utils/firebase";

import GoogleButtonStyling from "./GoogleButtonStyling";

function GoogleSignOutButton() {
  async function signOutUser() {
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
