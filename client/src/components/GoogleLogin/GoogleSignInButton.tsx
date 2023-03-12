import { useState } from "react";

import Button from "@mui/material/Button";

// Firebase
import { GoogleAuthProvider, signInWithRedirect } from "firebase/auth";
import { auth } from "../../utils/firebase";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";
import { ReactComponent as GoogleLogoWhite } from "../../assets/google_logo_white.svg";

import GoogleButtonStyling from "./GoogleButtonStyling";
import apiCalendar from "../../calendar/googleCalendar";

async function redirectToSignIn() {
  const provider: GoogleAuthProvider = new GoogleAuthProvider();

  // add access to Google Calendar API -- view and edit events
  provider.addScope("https://www.googleapis.com/auth/calendar.events");

  // calendar API sign-in
  apiCalendar.handleAuthClick();

  // redirect user to sign in page
  await signInWithRedirect(auth, provider);
}

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
