import express, { RequestHandler } from "express";
import { Identifier } from "./db/sequelizeInstance.js";
import logger from "./logging/logger.js";
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
const getDepartureTimesForStation: RequestHandler<getArrivalTimesParams> = (
  req,
  res,
  _next
) => {
  const station = req.params.station.toUpperCase();
  const identifier = req.header("identifier");
  logger.info(`Departure Times Requested for ${station} by ${identifier}`, {
    station,
    identifier,
  });

  const arrivals = subway.getDepartureTimesByStationId(station);
  const stationInfo = subway.getStationById(station);
  const lastUpdated = subway.lastUpdatedMillis;
  res.send({
    arrivals,
    stationInfo,
    lastUpdated,
  });
};
api.get("/departures/:station", getDepartureTimesForStation);

/*=============================
GET Stations
=============================*/
interface getStationByGtfsIdParams {
  train: string;
}
const getStations: RequestHandler<getStationByGtfsIdParams> = (
  req,
  res,
  _next
) => {
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
api.get("/stations/:train", getStations);
api.get("/stations", getStations);

/*=============================
GET Stations
=============================*/
interface getStationByGtfsIdParams {
  gtfsId: string;
}
const getStationByGtfsId: RequestHandler<getStationByGtfsIdParams> = (
  req,
  res,
  _next
) => {
  const gtfsId = req.params.gtfsId?.toUpperCase();
  const station = subway.getStationById(gtfsId);
  res.send({
    station,
  });
};
api.get("/station/:gtfsId", getStationByGtfsId);

/*=============================
POST ID
=============================*/
interface createIdBody {
  referrer: string;

  /** An object with misc details that we can save. */
  details: {
    height: number;
    width: number;
  };
}

interface createIdResponse {
  identifier: string;
}

const getId: RequestHandler<any, createIdResponse, createIdBody> = async (
  req,
  res,
  _next
) => {
  const { referrer = "", details: { height = null, width = null } = {} } =
    req.body;
  try {
    const identifier = await Identifier.create({
      referrer: referrer?.slice(0, 255),
      height,
      width,
      originalIp: req.ip,
      userAgent: req.header("User-Agent")?.slice(0, 255),
    });
    console.log("record", identifier.toJSON());
    res.send({ identifier: identifier.id });
  } catch (err) {
    console.log(err);
    res.status(406).send(err);
  }
};
api.post("/identifier", getId);
