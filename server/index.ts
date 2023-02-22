import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import resolutionCRUDAPI from "./resolution-crud-routes/resolutionCRUDRoutes";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const PORT_NUM = 3333;

app.use(express.json());

/* FIREBASE IMPORTS */
import { database } from "./utils/firebase";
import { ref, remove } from "firebase/database";

/* */

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.use(resolutionCRUDAPI);

// DB CRUD Test Endpoints
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
