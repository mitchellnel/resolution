import React, { useState, useEffect } from "react";

import Button from "@mui/material/Button";

// Firebase
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import {
  Auth,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  signInWithRedirect,
  User,
  UserCredential,
} from "firebase/auth";

import { ReactComponent as GoogleLogo } from "../../assets/google_logo.svg";
import { ReactComponent as GoogleLogoWhite } from "../../assets/google_logo_white.svg";

interface GoogleSignInButtonProps {
  setAuthenticatedFlag: (flagState: boolean) => void;
  setUser: (user: User) => void;
}

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDAseiGrImJilP9immR_yspzVF9LUOGZhI",
  authDomain: "resolution-bcmmz.firebaseapp.com",
  databaseURL: "https://resolution-bcmmz-default-rtdb.firebaseio.com",
  projectId: "resolution-bcmmz",
  storageBucket: "resolution-bcmmz.appspot.com",
  messagingSenderId: "132359590757",
  appId: "1:132359590757:web:6c2bf789203dd4873d478c",
  measurementId: "G-GP51SC0WBL",
};

const firebaseApp: FirebaseApp = initializeApp(firebaseConfig);

const provider: GoogleAuthProvider = new GoogleAuthProvider();
const auth: Auth = getAuth(firebaseApp);

async function redirectToSignIn() {
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
