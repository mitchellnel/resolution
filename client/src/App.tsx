import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";

import { API_TIME_ENDPOINT } from "./constants";

function App() {
  const [time, setTime] = useState<string>("");

  // use API call to get time from server and set state when it has been received
  const getTime = async () => {
    try {
      const res = await fetch(API_TIME_ENDPOINT);
      const json = await res.json();

      const time = json.message;

      setTime(time);
    } catch (err) {
      console.log(err);
    }
  };

  // useEffect to call getTime every second
  useEffect(() => {
    // call getTime() every 1000ms = 1s
    const intervalCall = setInterval(() => {
      getTime();
    }, 1000);

    return () => {
      // clean up
      clearInterval(intervalCall);
    };
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>The current time is {time}</p>
      </header>
    </div>
  );
}

export default App;
