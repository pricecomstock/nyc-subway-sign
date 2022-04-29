import {
  Station,
  stations,
  getStationById,
  getStationListByTrain,
} from "./station.js";
import { getDepartureTimes, ArrivalDepartureTime } from "./realTimeArrival.js";
import { UPDATE_INTERVAL_MS } from "../config.js";

export class Subway {
  private updateIntervalMs: number;
  private departureTimes: ArrivalDepartureTime[];
  private departureTimesMap: Map<string, ArrivalDepartureTime[]>;

  private realTimeUpdateIntervalId: NodeJS.Timeout = setTimeout(() => {}, 0);
  public lastUpdatedMillis = Date.now();

  constructor() {
    this.departureTimes = [];
    this.departureTimesMap = new Map<string, ArrivalDepartureTime[]>();

    this.updateIntervalMs = UPDATE_INTERVAL_MS;
  }

  async instantiate(): Promise<void> {
    await this.syncRealTimeDepartures();
    this.startRealTimeUpdates(this.updateIntervalMs); // update once per minute
    return;
  }

  getStationById(id: string): Station | undefined {
    return getStationById(id);
  }

  getStationListByTrain(train: string): Station[] {
    return getStationListByTrain(train);
  }

  getAllStations(): Station[] {
    return stations;
  }

  async syncRealTimeDepartures() {
    this.departureTimes = await getDepartureTimes();
    this.lastUpdatedMillis = Date.now();
    this.departureTimesMap = new Map<string, ArrivalDepartureTime[]>();
    console.log(`${this.departureTimes.length} departure time updates`);

    this.departureTimes.forEach((departureTime: ArrivalDepartureTime) => {
      const { stationDirection } = departureTime;

      const stationDepartureTimes =
        this.departureTimesMap.get(stationDirection) ?? [];

      // // Check if unique before adding
      // // Not sure if this is necessary if replacing whole array
      // // But it's conceivable that different feeds could have same routes
      // // when like D runs on A tracks
      // if (
      //   // If not any have same route id
      //   !stationDepartureTimes.some(
      //     (dt: ArrivalDepartureTime) => dt.routeId === departureTime.routeId
      //   )
      // ) {
      stationDepartureTimes.push(departureTime);
      // }

      this.departureTimesMap.set(stationDirection, stationDepartureTimes);
    });
  }

  getDepartureTimesByStationId(id: string): ArrivalDepartureTime[] {
    const hasDirection = ["N", "S"].includes(id.slice(-1));
    if (hasDirection) {
      return this.departureTimesMap.get(id) ?? [];
    } else {
      return [
        ...(this.departureTimesMap.get(id + "N") ?? []),
        ...(this.departureTimesMap.get(id + "S") ?? []),
      ];
    }
  }

  startRealTimeUpdates(intervalMs: number) {
    console.log(`Pulling data from MTA every ${intervalMs / 1000} seconds`);
    this.realTimeUpdateIntervalId = setInterval(() => {
      this.syncRealTimeDepartures();
    }, intervalMs);
  }

  pauseRealTimeUpdates() {
    console.log(`Pausing data pull from MTA`);
    clearInterval(this.realTimeUpdateIntervalId);
  }
}
