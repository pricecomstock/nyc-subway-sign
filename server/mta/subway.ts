import { fetchStations, Station } from "./station.js";
import { getDepartureTimes, ArrivalDepartureTime } from "./realTimeArrival.js";

export class Subway {
  private stationsByGTFSId: Map<string, Station>;
  private stationsListByTrain: Map<string, Station[]>;
  private stations: Station[];
  private departureTimes: ArrivalDepartureTime[];
  private departureTimesMap: Map<string, ArrivalDepartureTime[]>;

  private realTimeUpdateIntervalId: NodeJS.Timeout = setTimeout(() => {}, 0);

  constructor() {
    this.stations = [];
    this.stationsByGTFSId = new Map<string, Station>();
    this.stationsListByTrain = new Map<string, Station[]>();

    this.departureTimes = [];
    this.departureTimesMap = new Map<string, ArrivalDepartureTime[]>();
  }

  private async downloadStations() {
    this.stations = await fetchStations();
    this.stationsByGTFSId = new Map(
      this.stations.map((station: Station) => {
        return [station.gtfsStopId, station];
      })
    );

    this.stationsListByTrain = this.stations.reduce((accMap, station) => {
      station.trains.forEach((train) => {
        const stationsForTrain = accMap.get(train) ?? [];
        stationsForTrain.push(station);
        accMap.set(train, stationsForTrain);
      });
      return accMap;
    }, new Map());
  }

  async instantiate(): Promise<void> {
    await Promise.all([this.downloadStations(), this.syncRealTimeDepartures()]);
    this.startRealTimeUpdates(60000); // update once per minute
    return;
  }

  getStationById(id: string): Station | undefined {
    return this.stationsByGTFSId.get(id.toUpperCase());
  }

  getStationListByTrain(train: string): Station[] {
    return this.stationsListByTrain.get(train.toUpperCase()) ?? [];
  }

  getAllStations(): Station[] {
    return this.stations;
  }

  async syncRealTimeDepartures() {
    this.departureTimes = await getDepartureTimes();
    this.departureTimesMap = new Map<string, ArrivalDepartureTime[]>();
    console.log(`${this.departureTimes.length} departure time updates`);

    this.departureTimes.forEach((departureTime: ArrivalDepartureTime) => {
      const { stationDirection } = departureTime;

      const stationDepartureTimes =
        this.departureTimesMap.get(stationDirection) ?? [];

      // Check if unique before adding
      // Not sure if this is necessary if replacing whole array
      // But it's conceivable that different feeds could have same routes
      // when like D runs on A tracks
      if (
        // If not any have same route id
        !stationDepartureTimes.some(
          (dt: ArrivalDepartureTime) => dt.routeId === departureTime.routeId
        )
      ) {
        stationDepartureTimes.push(departureTime);
      }

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

  startRealTimeUpdates(ms: number) {
    this.realTimeUpdateIntervalId = setInterval(() => {
      this.syncRealTimeDepartures();
    }, ms);
  }

  pauseRealTimeUpdates() {
    clearInterval(this.realTimeUpdateIntervalId);
  }
}
