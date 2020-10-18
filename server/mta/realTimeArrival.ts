import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import axios, { AxiosRequestConfig } from "axios";

const MTA_API_KEY: string | undefined = process.env.MTA_API_KEY;

export class ArrivalDepartureTime {
  public readonly stationId: string;
  public readonly direction: string;
  public readonly stationDirection: string;
  public readonly train: string;
  public readonly timestamp: number;
  public readonly tripId: string;
  public readonly routeId: string;
  constructor(
    stationDirection: string,
    timestamp: number,
    train: string,
    tripId: string,
    routeId: string
  ) {
    this.stationDirection = stationDirection;
    this.train = train;
    this.timestamp = timestamp;
    this.stationId = stationDirection.slice(0, -1);
    this.direction = stationDirection.slice(-1); // last character
    this.tripId = tripId;
    this.routeId = routeId;
  }
}

export interface TripDescriptor {
  tripId: string;
  startTime: string;
  startDate: string;
  routeId: string;
}

export interface TripUpdate {
  stopTimeUpdate: StopTimeUpdate[];
  trip: TripDescriptor;
}

export interface Entity {
  tripUpdate?: TripUpdate;
  vehiclePosition?: any; // If I ever need this
}

export interface TripUpdateEntity {
  tripUpdate: TripUpdate;
}

export interface StopTimeEvent {
  time: {
    low: number;
    high: number;
    unsigned: boolean;
  };
}

export interface StopTimeUpdate {
  stopId: string;
  arrival: StopTimeEvent;
  departure: StopTimeEvent;
}

const API_URLS = [
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-g",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-jz",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-nqrw",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-l",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs",
  "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-7",
];

const headers = { "x-api-key": MTA_API_KEY };
const responseType = "arraybuffer";

const axiosOptions: AxiosRequestConfig = {
  headers,
  responseType,
};

export async function syncDepartureTimesFromURL(url: string) {
  const response = await axios.get(url, axiosOptions);
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    response.data
  );

  const departureTimes: ArrivalDepartureTime[] = feed.entity
    .filter((entity: { tripUpdate?: TripUpdate }) => entity?.tripUpdate)
    .flatMap((entity: TripUpdateEntity) => {
      const train = entity.tripUpdate?.trip?.routeId;
      const tripId = entity.tripUpdate?.trip?.tripId;
      const routeId = entity.tripUpdate?.trip?.routeId;

      const stopTimeUpdates = entity.tripUpdate?.stopTimeUpdate;

      if (stopTimeUpdates) {
        return stopTimeUpdates
          .filter((stopTime: StopTimeUpdate) => stopTime.departure) // some only have departures
          .map((stopTime: StopTimeUpdate) => {
            const station = stopTime.stopId;
            const timestamp = stopTime.departure.time.low;
            return new ArrivalDepartureTime(
              station,
              timestamp,
              train,
              tripId,
              routeId
            );
          });
      }

      return [];
    });

  return departureTimes;
}

export async function getDepartureTimes(): Promise<ArrivalDepartureTime[]> {
  const arrivals = await Promise.all(API_URLS.map(syncDepartureTimesFromURL));
  return arrivals.flat();
}
