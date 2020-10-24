<script lang="ts">
  import TrainPicker from "./components/TrainPicker.svelte";
  import Stations from "./components/Stations.svelte";
  import Arrivals from "./components/Arrivals.svelte";
  import { onMount } from "svelte";

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
    url.searchParams.set("station", selectedStation.gtfsStopId);

    window.history.replaceState(
      { page: 1 },
      `NYC Subway Sign - ${selectedStation}`,
      `?${url.searchParams.toString()}`
    );
  }

  async function loadFromUrlParams() {
    const query = new URLSearchParams(parent.location.search);
    const queryStation = query.get("station");
    if (queryStation) {
      showTrainPicker = false;
      const station = await getStationById(queryStation);
      selectedStation = station;
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
  }

  async function initializeForSelectedStation() {
    console.log("initializing");
    await updateArrivalTimes();
    setUpdateEvery(10000);
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
</style>

<main>
  <Arrivals {arrivals} station={selectedStation} />
  {#if showTrainPicker}
    <TrainPicker on:select={handlePickTrainEvent} />
    {#if stations.length}
      <Stations
        {stations}
        train={selectedTrain}
        on:select={handlePickStationEvent} />
    {:else}
      <p>Pick a train</p>
    {/if}
  {/if}
  <p class="disclaimer">
    Due to lag time in the MTA real-time feeds, information may not be accurate
  </p>
</main>
