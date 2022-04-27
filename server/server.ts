import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";
import { api } from "./router.js";

const { json } = bodyParser;

const app = express();

app.use(json());
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

const corsOpts = cors();
if (process.env.NODE_ENV === "production") {
  app.use("/api", api);
} else {
  app.options("*", corsOpts);
  app.use("/api", corsOpts, api);
}

// Static serve of build folder
app.use(express.static("public"));

// Fallback to sending index.hmtl
app.get("/*", (_req, res) => {
  res.sendFile(path.resolve("./public/build/index.html"));
});
const port = process.env.PORT || 3000;

app.listen(port);
