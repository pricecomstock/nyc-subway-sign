import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { api } from "./router.js";

const { json } = bodyParser;

const app = express();

app.use(json());
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.use("/api", api);

app.listen(3000);
