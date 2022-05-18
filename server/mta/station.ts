import axios from "axios";
import fs from "fs";
import path from "path";
import parse from "csv-parse/lib/sync.js";

const MTA_STATION_CSV_URL =
  "http://web.mta.info/developers/data/nyct/subway/Stations.csv";
const LOCAL_STATION_CSV_FILE = "./public/stations-backup.csv";

interface stationCSVRecord {
  "Station ID": string;
  "Complex ID": string;
  "GTFS Stop ID": string;
  Division: string;
  Line: string;
  "Stop Name": string;
  Borough: string;
  "Daytime Routes": string;
  Structure: string;
  "GTFS Latitude": string;
  "GTFS Longitude": string;
  "North Direction Label": string;
  "South Direction Label": string;
  ADA: string;
  "ADA Notes": string;
}

export class Station {
  stationId: string;
  complexId: string;
  gtfsStopId: string;
  division: string;
  line: string;
  stopName: string;
  borough: string;
  trains: string[];
  structure: string;
  gtfsLatitude: number;
  gtfsLongitude: number;
  northDirectionLabel: string;
  southDirectionLabel: string;
  ada: boolean;
  adaNotes: string;

  constructor(record: stationCSVRecord) {
    this.stationId = record["Station ID"];
    this.complexId = record["Complex ID"];
    this.gtfsStopId = record["GTFS Stop ID"];
    this.division = record["Division"];
    this.line = record["Line"];
    this.stopName = record["Stop Name"];
    this.borough = record["Borough"];
    this.trains = record["Daytime Routes"].split(" ");
    this.structure = record["Structure"];
    this.gtfsLatitude = Number(record["GTFS Latitude"]);
    this.gtfsLongitude = Number(record["GTFS Longitude"]);
    this.northDirectionLabel = record["North Direction Label"];
    this.southDirectionLabel = record["South Direction Label"];
    this.ada = Boolean(record["ADA"]);
    this.adaNotes = record["ADA Notes"];
  }
}

export async function fetchStations(): Promise<Station[]> {
  const stations = await fetchAndParseStationCSV();
  return stations.map((station: stationCSVRecord) => new Station(station));
}

export async function fetchAndParseStationCSV(): Promise<stationCSVRecord[]> {
  try {
    const stationCsv = await fetchStationCSVFromMTA();
    return parse(stationCsv, { columns: true });
  } catch (error) {
    const stationCsv = fetchStationCSVLocally();
    return parse(stationCsv, { columns: true });
  }
}

async function fetchStationCSVFromMTA(): Promise<string> {
  const response = await axios.get<string>(MTA_STATION_CSV_URL, {
    timeout: 5000,
  });
  return response.data;
}

function fetchStationCSVLocally(): string {
  const filePath = path.resolve(LOCAL_STATION_CSV_FILE);
  // doing this sync because I don't think it supports await
  const stations = fs.readFileSync(filePath).toString();
  return stations;
}

export const stations = await fetchStations();
export const stationsByGTFSId = new Map(
  stations.map((station: Station) => {
    return [station.gtfsStopId, station];
  })
);
export const stationsListByTrain = stations.reduce((accMap, station) => {
  station.trains.forEach((train) => {
    const stationsForTrain = accMap.get(train) ?? [];
    stationsForTrain.push(station);
    accMap.set(train, stationsForTrain);
  });
  return accMap;
}, new Map());

export function getStationById(id: string): Station | undefined {
  return stationsByGTFSId.get(id.toUpperCase());
}

export function getStationListByTrain(train: string): Station[] {
  return stationsListByTrain.get(train.toUpperCase()) ?? [];
}
