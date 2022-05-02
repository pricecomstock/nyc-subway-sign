import type { Station } from "../server/mta/station";
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

export class DisplayStation {
  /**
   * The Station to display
   */
  public station: Station;

  /**
   * Options that apply only to this station
   */
  public options: DisplayOptions;
}

export class AppState {
  public displays: DisplayStation[];

  public globalOptions: object;

  // public changeListeners: [];

  constructor(displays: DisplayStation[] = [], globalOptions: object = {}) {
    this.displays = displays;
    this.globalOptions = globalOptions;
  }

  // addChangeListener(fn: Function) {}

  // markChanged() {}

  addDisplayStation(displayStation: DisplayStation) {
    this.displays.push(displayStation);
  }

  overwriteDisplayStation(index: number, displayStation: DisplayStation) {
    this.displays.splice(index, 1, displayStation);
  }

  removeDisplayStation(index: number) {
    this.displays.splice(index, 1);
  }
}
