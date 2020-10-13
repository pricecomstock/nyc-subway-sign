import express, { RequestHandler } from "express";
import { Subway } from "./mta/subway.js";

let subway = new Subway();
subway.instantiate();

export const api = express.Router();
api.get("/", (_req, res, _next) => {
  res.send({
    message: "Hello!",
  });
});

/*=============================
GET Arrival Times
=============================*/
interface getArrivalTimesParams {
  station: string;
}
const getArrivalTimesForStation: RequestHandler<getArrivalTimesParams> = (
  req,
  res,
  _next
) => {
  const station = req.params.station.toUpperCase();
  const arrivals = subway.getArrivalTimesByStationId(station);
  const stationInfo = subway.getStationById(station);
  res.send({
    arrivals,
    stationInfo,
  });
};
api.get("/arrivals/:station", getArrivalTimesForStation);

/*=============================
GET Stations
=============================*/
interface getStationsParams {
  train: string;
}
const getStations: RequestHandler<getStationsParams> = (req, res, _next) => {
  const train = req.params.train?.toUpperCase();
  let stations = [];
  if (train) {
    stations = subway.getStationListByTrain(train);
  } else {
    stations = subway.getAllStations();
  }
  res.send({
    stations,
  });
};
api.get("/stations/:train?", getStations);
api.get("/stations", getStations);
