import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import { Subway } from "./mta/subway.js";

let subway = new Subway();
subway.instantiate().then(() => {
  console.log(subway.getStationById("M11"));
  const arrivalTimes = subway.getArrivalTimesByStationId("M11");
  arrivalTimes.forEach((at) => {
    console.log(
      `${at.train} arriving at ${at.stationDirection} at ${new Date(
        at.timestamp * 1000
      )}`
    );
  });
});

const { json } = bodyParser;

const app = express();

app.use(json());
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  res.status(500).json({ message: err.message });
});

app.listen(3000);
