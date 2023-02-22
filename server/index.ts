import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import resolutionCRUDAPI from "./resolution-crud-routes/resolutionCRUDRoutes";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const PORT_NUM = 3333;

app.use(express.json());

/* FIREBASE IMPORTS */
import { database } from "./utils/firebase";
import { ref, child, push, update, remove } from "firebase/database";

/* */

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(resolutionCRUDAPI);

// DB CRUD Test Endpoints
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

app.post("/api/delete", async (req: Request, res: Response) => {
  // get the path to delete
  // reject request if path not included
  const data = req.body;
  const deletePath: string = data["deletePath"] ?? "";

  if (deletePath === "") {
    res.send("No delete path given");
    return;
  }

  // delete data at the path
  try {
    await remove(ref(database, deletePath));
    res.send("Deletion successful!");
  } catch (err) {
    console.log(err);
    res.send("Deletion was not successful ...");
  }
});

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
