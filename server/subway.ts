import { fetchStations, Station } from "./station";

export class Subway {
  private stationsByGTFSId: Map<string, Station>;
  private stations: Station[];

  constructor() {
    this.stations = [];
    this.stationsByGTFSId = new Map<string, Station>();
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
    await this.downloadStations();
    return;
  }

  getStationById(id: string): Station | undefined {
    return this.stationsByGTFSId.get(id);
  }
}
