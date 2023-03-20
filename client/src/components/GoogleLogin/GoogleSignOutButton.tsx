import Button from "@mui/material/Button";

// Firebase
import { signOut } from "firebase/auth";
import apiCalendar from "../../calendar/googleCalendar";
import { auth } from "../../utils/firebase";

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

/**
 * Button to sign out of the application.
 * 
 * @group Components
 * @category Page
 * @returns GoogleSignOutButton component
 */
function GoogleSignOutButton() {
  async function signOutUser() {
    apiCalendar.handleSignoutClick();

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
