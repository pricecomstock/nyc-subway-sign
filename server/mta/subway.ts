import { fetchStations, Station } from "./station.js";
import { getArrivalTimes, ArrivalTime } from "./realTimeArrival.js";

export class Subway {
  private stationsByGTFSId: Map<string, Station>;
  private stations: Station[];
  private arrivalTimes: ArrivalTime[];
  private arrivalTimesMap: Map<string, ArrivalTime[]>;

  private realTimeUpdateIntervalId: NodeJS.Timeout = setTimeout(() => {}, 0);

  constructor() {
    this.stations = [];
    this.stationsByGTFSId = new Map<string, Station>();

    this.arrivalTimes = [];
    this.arrivalTimesMap = new Map<string, ArrivalTime[]>();
  }

  private async downloadStations() {
    this.stations = await fetchStations();
    this.stationsByGTFSId = new Map(
      this.stations.map((station: Station) => {
        return [station.gtfsStopId, station];
      })
    );
  }

  async instantiate(): Promise<void> {
    await Promise.all([this.downloadStations(), this.syncRealTimeArrivals()]);
    this.startRealTimeUpdates(60000); // update once per minute
    return;
  }

  getStationById(id: string): Station | undefined {
    return this.stationsByGTFSId.get(id);
  }

  async syncRealTimeArrivals() {
    this.arrivalTimes = await getArrivalTimes();
    console.log(`${this.arrivalTimes.length} arrival time updates`);
    this.arrivalTimes.forEach((arrivalTime: ArrivalTime) => {
      const { stationDirection } = arrivalTime;
      const existingStationArrivalTimes =
        this.arrivalTimesMap.get(stationDirection) || [];

      // Remove old timestamps
      const newStationArrivalTimes = existingStationArrivalTimes.filter(
        ({ timestamp }) => {
          const isPast = timestamp < Date.now() / 1000;
          return !isPast;
        }
      );

      // Check if unique before adding
      if (
        // If not any have same train and time, then add
        !newStationArrivalTimes.some((at: ArrivalTime) => {
          at.train === arrivalTime.train &&
            at.timestamp === arrivalTime.timestamp;
        })
      ) {
        newStationArrivalTimes.push(arrivalTime);
      }

      this.arrivalTimesMap.set(stationDirection, newStationArrivalTimes);
    });
  }

  purgePastArrivalTimes() {
    // TODO if the data coming in is incomplete
    // Then we need to iterate over the map and remove past arrival times
    // Would also mean that this.arrivalTimes (the array) cannot be trusted as it's incomplete
  }

  getArrivalTimesByStationId(id: string): ArrivalTime[] {
    const hasDirection = ["N", "S"].includes(id.slice(-1));
    if (hasDirection) {
      return this.arrivalTimesMap.get(id) ?? [];
    } else {
      return [
        ...(this.arrivalTimesMap.get(id + "N") ?? []),
        ...(this.arrivalTimesMap.get(id + "S") ?? []),
      ];
    }
  }

  startRealTimeUpdates(ms: number) {
    this.realTimeUpdateIntervalId = setInterval(() => {
      this.syncRealTimeArrivals();
    }, ms);
  }

  pauseRealTimeUpdates() {
    clearInterval(this.realTimeUpdateIntervalId);
  }
}
