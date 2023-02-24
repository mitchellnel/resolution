import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import resolutionCRUDAPI from "./resolution-crud-routes/resolutionCRUDRoutes";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const PORT_NUM = 3333;

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// use resolution CRUD API endpoints
app.use(resolutionCRUDAPI);

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
