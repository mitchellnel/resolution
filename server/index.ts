import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const PORT_NUM = 3333;

app.use(express.json());

/* FIREBASE SETUP */
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getDatabase,
  ref,
  set,
  child,
  get,
  push,
  update,
} from "firebase/database";
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

// DB CRUD Test Endpoints
app.post("/api/create", (req: Request, res: Response) => {
  const data = req.body;
  const json_data = JSON.stringify(data);

  // add data to the DB
  set(ref(database, "more/sample_data/"), json_data);

  res.send(`Data Received: ${json_data}\n\t... Data added to DB!`);
});

app.get("/api/read", async (req: Request, res: Response) => {
  // NOTE: should use onValue and return some listener -- maybe do this client side?

  // find out what DB path to read from
  // reject request if path not included
  if (req.query.path === undefined) {
    res.send("No path parameter sent");
    return;
  }

  const path = req.query.path as string;

  console.log(path);

  // get a snapshot of the data currently at the ref and path
  try {
    const snapshot = await get(child(ref(database), path));

    // data may not be available at ref and path
    if (snapshot.exists()) {
      res.send(snapshot.val());
    } else {
      res.send("No data available");
    }
  } catch (err) {
    console.log(err);
    res.send(err);
  }
});

app.post("/api/update", async (req: Request, res: Response) => {
  // push used instead of update -- makes more sense to "push" a new child onto the parent JSON node

  // get the path to push to
  // reject request if path not included
  const data = req.body;
  const pushPath: string = data["pushPath"] ?? "";

  if (pushPath === "") {
    res.send("No push path given");
    return;
  }

  // create the data to push
  const pushedData = {
    number: Math.random(),
  };

  // get a key for the new child
  const childKey = push(child(ref(database), pushPath)).key;

  // NOTE: you can simultaneously push multiple updates just by adding another field to the updates
  //  object
  const updates: any = {};
  updates[pushPath + childKey] = pushedData;

  try {
    await update(ref(database), updates);
    res.send("Update successful!");
  } catch (err) {
    console.log(err);
    res.send("Update not successful...");
  }
});

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
