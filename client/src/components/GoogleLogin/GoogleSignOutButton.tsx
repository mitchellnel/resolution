import React from "react";

import Button from "@mui/material/Button";

// Firebase
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Auth, getAuth, signOut } from "firebase/auth";

interface GoogleSignOutButtonProps {
  setAuthenticatedFlag: (flagState: boolean) => void;
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

const auth: Auth = getAuth(firebaseApp);

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
