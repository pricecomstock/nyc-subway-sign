import { QUERY_PARAMS } from "./helpers/constants";

export class DisplayOptions {
  constructor(
    public maxArrivals: number = 12,
    public maxArrivalsPerTrainDirection: number = 4,
    public hiddenTrainDirections: string[] = [],
    public soonestTrainArrivalMinutes: number = -0.7,
    public latestTrainArrivalMinutes: number = 60
  ) {}

  static fromURLParams(params: URLSearchParams) {
    return new DisplayOptions(
      Number(params.get(QUERY_PARAMS.MAX_ARRIVALS)),
      Number(params.get(QUERY_PARAMS.MAX_ARRIVALS_PER_TRAIN_DIRECTION)),
      params.get(QUERY_PARAMS.HIDDEN_TRAIN_DIRECTIONS).split(","),
      Number(params.get(QUERY_PARAMS.SOONEST_MINUTES)),
      Number(params.get(QUERY_PARAMS.LATEST_MINUTES))
    );
  }

  static fromBase64(b64) {
    if (!b64) return new DisplayOptions();
    return DisplayOptions.fromJSON(atob(b64));
  }

  static fromJSON(json) {
    const opts = JSON.parse(json);
    console.log("🔴====> ~ file: DisplaySpec.ts ~ line 28 ~ opts", opts);
    const {
      maxArrivals,
      maxArrivalsPerTrainDirection,
      hiddenTrainDirections,
      soonestTrainArrivalMinutes,
      latestTrainArrivalMinutes,
    } = opts;

    return new DisplayOptions(
      maxArrivals,
      maxArrivalsPerTrainDirection,
      hiddenTrainDirections,
      soonestTrainArrivalMinutes,
      latestTrainArrivalMinutes
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
      [
        QUERY_PARAMS.SOONEST_MINUTES,
        this.soonestTrainArrivalMinutes.toString(),
      ],
      [QUERY_PARAMS.LATEST_MINUTES, this.latestTrainArrivalMinutes.toString()],
    ]);
  }

  toBase64() {
    return btoa(JSON.stringify(this));
  }
}

export class DisplaySpec {
  constructor(public station: string, public options?: DisplayOptions) {
    this.options = options ?? new DisplayOptions();
  }
}
