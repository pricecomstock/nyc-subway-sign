import { QUERY_PARAMS } from "./helpers/constants";

export class DisplayOptions {
  constructor(
    public maxArrivals: number = 10,
    public maxArrivalsPerTrainDirection: number = 2,
    public hiddenTrainDirections: string[] = [],
    public soonestTrainArrival: number = -60000,
    public latestTrainArrival: number = 3600000
  ) {}

  static fromURLParams(params: URLSearchParams) {
    return new DisplayOptions(
      Number(params.get(QUERY_PARAMS.MAX_ARRIVALS)),
      Number(params.get(QUERY_PARAMS.MAX_ARRIVALS_PER_TRAIN_DIRECTION)),
      params.get(QUERY_PARAMS.HIDDEN_TRAIN_DIRECTIONS).split(","),
      Number(params.get(QUERY_PARAMS.SOONEST_ARRIVAL_MS)),
      Number(params.get(QUERY_PARAMS.LATEST_ARRIVAL_MS))
    );
  }

  toURLParams() {
    return new URLSearchParams([
      [QUERY_PARAMS.MAX_ARRIVALS, this.maxArrivals.toString()],
      [
        QUERY_PARAMS.MAX_ARRIVALS_PER_TRAIN_DIRECTION,
        this.maxArrivalsPerTrainDirection.toString(),
      ],
      [
        QUERY_PARAMS.HIDDEN_TRAIN_DIRECTIONS,
        this.hiddenTrainDirections.join(","),
      ],
      [QUERY_PARAMS.SOONEST_ARRIVAL_MS, this.soonestTrainArrival.toString()],
      [QUERY_PARAMS.LATEST_ARRIVAL_MS, this.latestTrainArrival.toString()],
    ]);
  }
}

export class DisplaySpec {
  constructor(public station: string, public options?: DisplayOptions) {
    this.options = options ?? new DisplayOptions();
  }
}
