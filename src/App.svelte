<script lang="ts">
  import TrainPicker from "./components/TrainPicker.svelte";
  import Stations from "./components/Stations.svelte";
  import Arrivals from "./components/Arrivals.svelte";
  import StationTitle from "./components/StationTitle.svelte";
  import { DisplaySpec, DisplayOptions } from "./DisplaySpec";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  const toDisplay = writable<DisplaySpec[]>([]);

  let displayOptions: DisplayOptions;
  const unsubscribe = toDisplay.subscribe((value) => {
    // TODO actually handle array
    displayOptions = value[0].options;
  });

  let selectedTrain = "";
  let selectedStation = {};
  let stations = [];
  let arrivals = [];
  let showTrainPicker = false;

  let intervalId;

  const baseUrl = __IS_DEVELOPMENT__
    ? "http://localhost:3000"
    : parent.location.origin;

  onMount(async () => {
    await loadFromUrlParams();
  });

  function writeUrlParams() {
    const url = new URL(parent.location.toString());
    url.search = displayOptions.toURLParams().toString();
    url.searchParams.set("station", selectedStation.gtfsStopId);

    window.history.replaceState(
      { page: 1 },
      `NYC Subway Sign - ${selectedStation}`,
      `?${url.searchParams.toString()}`
    );
  }

  async function loadFromUrlParams() {
    const query = new URLSearchParams(parent.location.search);
    const options = DisplayOptions.fromURLParams(query);
    const queryStation = query.get("station");
    if (queryStation) {
      showTrainPicker = false;
      const station = await getStationById(queryStation);
      selectedStation = station;
      // TODO switch this to station object instead of string
      toDisplay.set([new DisplaySpec(selectedStation.gtfsStopId, options)]);
      await initializeForSelectedStation();
    } else {
      showTrainPicker = true;
    }
  }

  async function getStationsForTrain(train) {
    const response = await fetch(`${baseUrl}/api/stations/${train}`);
    const data = await response.json();
    stations = data.stations;
  }

  async function getStationById(gtfsId: string) {
    const response = await fetch(`${baseUrl}/api/station/${gtfsId}`);
    const data = await response.json();
    return data.station;
  }

  async function getArrivalsForStation(station) {
    const { gtfsStopId } = station;
    const response = await fetch(`${baseUrl}/api/departures/${gtfsStopId}`);
    const data = await response.json();
    arrivals = data.arrivals;
  }

  function handlePickTrainEvent(event) {
    selectedTrain = (event as CustomEvent<{ train: string }>).detail.train;
    getStationsForTrain(selectedTrain);
  }

  function handlePickStationEvent(event) {
    selectedStation = (event as CustomEvent<{ station: string }>).detail
      .station;
    writeUrlParams();
    initializeForSelectedStation();
    showTrainPicker = false;
  }

  async function initializeForSelectedStation() {
    console.log("initializing");
    await updateArrivalTimes();
    setUpdateEvery(30000);
  }

  async function updateArrivalTimes() {
    console.log("fetching arrival times for", selectedStation);
    await getArrivalsForStation(selectedStation);
  }

  function setUpdateEvery(ms) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateArrivalTimes, ms);
  }
</script>

<main>
  <Arrivals {arrivals} station={selectedStation} />

  <div class="footer">
    <div class="station-title-and-change-btn">
      <span>
        <StationTitle
          station={selectedStation}
          on:pickNewStation={() => {
            showTrainPicker = true;
          }}
        />
      </span>
      <span>
        <button
          on:click={() => {
            showTrainPicker = !showTrainPicker;
          }}>change</button
        >
      </span>
    </div>

    <p class="disclaimer">
      Due to lag time in the MTA real-time feeds, information may not be
      accurate
    </p>
  </div>
  {#if showTrainPicker}
    <div class="train-station-picker">
      <TrainPicker on:select={handlePickTrainEvent} />
      {#if stations.length}
        <Stations
          {stations}
          train={selectedTrain}
          on:select={handlePickStationEvent}
        />
      {:else}
        <p>Pick a train</p>
      {/if}
    </div>
  {/if}
</main>

<style>
  div {
    height: 40px;
  }
  main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  }

  .disclaimer {
    font-size: 0.75rem;
    color: var(--mta-s);
  }

  .station-title-and-change-btn {
    display: inline-flex;
    align-items: center;
    flex: 1 0 70%;
    align-self: left;
  }

  .disclaimer {
    flex: 0 1 30%;
    align-self: right;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem 0;
  }

  button {
    font-size: 0.7em;
  }
</style>
