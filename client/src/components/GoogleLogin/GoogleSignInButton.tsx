import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";

// Firebase
import {
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
  UserCredential,
} from "firebase/auth";
import { auth } from "../../utils/firebase";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";
import { ReactComponent as GoogleLogoWhite } from "../../assets/google_logo_white.svg";

import GoogleButtonStyling from "./GoogleButtonStyling";

interface GoogleSignInButtonProps {
  setAuthenticatedFlag: (flagState: boolean) => void;
  setUser: (user: User) => void;
}

async function redirectToSignIn() {
  const provider: GoogleAuthProvider = new GoogleAuthProvider();

  // add access to Google Calendar API -- view and edit events
  provider.addScope("https://www.googleapis.com/auth/calendar.events");

  // redirect user to sign in page
  await signInWithRedirect(auth, provider);
}

function GoogleSignInButton({
  setAuthenticatedFlag,
  setUser,
}: GoogleSignInButtonProps) {
  const [buttonMouseover, setButtonMouseover] = useState<Boolean>(false);

  useEffect(() => {
    const completeSignIn = async () => {
      try {
        // get the user's ID token
        const redirectResult: UserCredential | null = await getRedirectResult(
          auth
        );
        const user: User | undefined = redirectResult?.user;

        if (user === undefined) {
          throw new Error("User from redirect result is not defined");
        }

        setAuthenticatedFlag(true);
        setUser(user);
      } catch (err) {
        console.log(err);
      }
    };

    completeSignIn();
  }, [setAuthenticatedFlag, setUser]);

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
