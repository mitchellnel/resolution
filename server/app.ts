import express, { Express, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import dotenv from "dotenv";

import resolutionCRUDAPI from "./routes/resolutionCRUDRoutes";
import goalCRUDAPI from "./routes/goalCRUDRoutes";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();

const corsOptions: CorsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

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

// use goal CRUD API endpoints
app.use(goalCRUDAPI);

export default app;
