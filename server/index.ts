import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const PORT_NUM = 3333;

/* FIREBASE SETUP */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAseiGrImJilP9immR_yspzVF9LUOGZhI",
  authDomain: "resolution-bcmmz.firebaseapp.com",
  projectId: "resolution-bcmmz",
  storageBucket: "resolution-bcmmz.appspot.com",
  messagingSenderId: "132359590757",
  appId: "1:132359590757:web:6c2bf789203dd4873d478c",
  measurementId: "G-GP51SC0WBL",
  databaseURL: "https://resolution-bcmmz-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
// @ts-ignore
const firebase_app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(firebase_app);

/* */

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/api/time", (_: Request, res: Response) => {
  const date_obj = new Date();
  const curr_time =
    String(date_obj.getHours()).padStart(2, "0") +
    ":" +
    String(date_obj.getMinutes()).padStart(2, "0") +
    ":" +
    String(date_obj.getSeconds()).padStart(2, "0");

  res.json({ message: "The current time is " + curr_time });
});

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
