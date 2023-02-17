import React, { useState } from "react";
import logo from "./logo.svg";
import "./App.css";

import GoogleSignInButton from "./components/GoogleLogin/GoogleLogin";
import { User } from "firebase/auth";

function App() {
  // state objects for authentication and the user
  const [authenticatedFlag, setAuthenticatedFlag] = useState<boolean>(false);
  const [user, setUser] = useState<User>();

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        {authenticatedFlag ? (
          <h1>Hello, {user?.displayName}!</h1>
        ) : (
          <h1>Please authenticate yourself using the button below.</h1>
        )}

        <GoogleSignInButton
          setAuthenticatedFlag={setAuthenticatedFlag}
          setUser={setUser}
        />
      </header>
    </div>
  );
}

export default App;
