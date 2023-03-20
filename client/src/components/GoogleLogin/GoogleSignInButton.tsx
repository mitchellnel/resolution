import { useState } from "react";

import Button from "@mui/material/Button";

// Firebase
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../utils/firebase";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";
import { ReactComponent as GoogleLogoWhite } from "../../assets/google_logo_white.svg";

const GoogleButtonStyling = {
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
};

async function redirectToSignIn() {
  const provider: GoogleAuthProvider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  // redirect user to sign in page
  await signInWithRedirect(auth, provider);
}

/**
 * Button to sign into the application by prompting a redirect to a page to sign in with Google.
 * 
 * @group Components
 * @category Page
 * @returns GoogleSignInButton component
 */
function GoogleSignInButton() {
  const [buttonMouseover, setButtonMouseover] = useState<Boolean>(false);

  return (
    <>
      <Button
        variant="contained"
        size="large"
        startIcon={buttonMouseover ? <GoogleLogoWhite /> : <GoogleLogo />}
        sx={GoogleButtonStyling}
        onClick={redirectToSignIn}
        onMouseOver={() => setButtonMouseover(true)}
        onMouseOut={() => setButtonMouseover(false)}
      >
        Sign in with Google
      </Button>
    </>
  );
}

export default GoogleSignInButton;
