"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "./.env.development.local" });
const app = (0, express_1.default)();
const port = process.env.PORT_NUM;
app.get("/", (_, res) => {
    res.send("Express + TypeScript Server");
});
app.get("/time", (_, res) => {
    const date_obj = new Date();
    const curr_time = String(date_obj.getHours()).padStart(2, "0") +
        ":" +
        String(date_obj.getMinutes()).padStart(2, "0") +
        ":" +
        String(date_obj.getSeconds()).padStart(2, "0");
    res.json({ message: "The current time is " + curr_time });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map