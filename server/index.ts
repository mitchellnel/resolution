import cors, { CorsOptions } from "cors";

import app from "./app";

const PORT_NUM = 3333;

const corsOptions: CorsOptions = {
  origin: "https://mitchellnel.github.io",
};

app.use(cors(corsOptions));

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
