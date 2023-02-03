import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config({ path: "./.env.development.local" });

const app: Express = express();
const port = process.env.PORT_NUM;

app.get("/", (_: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.get("/time", (_: Request, res: Response) => {
  const date_obj = new Date();
  const curr_time =
    date_obj.getHours() +
    ":" +
    date_obj.getMinutes() +
    ":" +
    date_obj.getSeconds();

  res.json({ message: "The current time is " + curr_time });
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
