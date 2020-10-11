import GtfsRealtimeBindings from "gtfs-realtime-bindings";
import axios, { AxiosRequestConfig } from "axios";

export class ArrivalTime {
  public readonly stationId: string;
  public readonly direction: string;
  constructor(
    public readonly stationDirection: string,
    public readonly train: string,
    public readonly timestamp: number
  ) {
    this.stationId = stationDirection.slice(0, -1);
    this.direction = stationDirection.slice(-1); // last character
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

const API_URLS = {
  BDFM:
    "https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-bdfm",
};

const headers = { "x-api-key": "B4K82Vsc318tLZie3Yol07ndm7wM2ozi51aOwDux" };
const responseType = "arraybuffer";

const axiosOptions: AxiosRequestConfig = {
  headers,
  responseType,
};

export async function getArrivalTimes() {
  const response = await axios.get(API_URLS.BDFM, axiosOptions);
  const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(
    response.data
  );

  const arrivalTimes: ArrivalTime[] = feed.entity
    .filter((entity: { tripUpdate?: TripUpdate }) => entity?.tripUpdate)
    .flatMap((entity: TripUpdateEntity) => {
      const train = entity.tripUpdate?.trip?.routeId;

      const stopTimeUpdates = entity.tripUpdate?.stopTimeUpdate;

      if (stopTimeUpdates) {
        return stopTimeUpdates.map((stopTime: StopTimeUpdate) => {
          const station = stopTime.stopId;
          const timestamp = stopTime.arrival.time.low;
          return new ArrivalTime(station, train, timestamp);
        });
      }

      return [];
    });

  return arrivalTimes;
}
