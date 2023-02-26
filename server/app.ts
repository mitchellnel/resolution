import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

import resolutionCRUDAPI from "./resolution-crud-routes/resolutionCRUDRoutes";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();

app.use(express.json());

app.get("/", (_: Request, res: Response) => {
  res
    .status(200)
    .send(
      "Resolution API v1 -- look at https://github.com/mitchellnel/resolution/tree/main/server#api-documentation for endpoint documentation."
    );
});

// use resolution CRUD API endpoints
app.use(resolutionCRUDAPI);

export default app;
