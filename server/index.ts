import app from "./app";

const PORT_NUM = 3333;

app.listen(PORT_NUM, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT_NUM}`);
});
