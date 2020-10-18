<script lang="ts">
  import TrainPicker from "./components/TrainPicker.svelte";
  import Stations from "./components/Stations.svelte";
  import Arrivals from "./components/Arrivals.svelte";
  import { onMount } from "svelte";

  let selectedTrain = "";
  let selectedStation = {};
  let stations = [];
  let arrivals = [];

  let intervalId;

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
    console.log("Query Params", queryStation);
    if (queryStation) {
      const station = await getStationById(queryStation);
      selectedStation = station;
      await initializeForSelectedStation();
    }
  }

  async function getStationsForTrain(train) {
    const response = await fetch(`http://localhost:3000/api/stations/${train}`);
    const data = await response.json();
    stations = data.stations;
  }

  async function getStationById(gtfsId: string) {
    const response = await fetch(`http://localhost:3000/api/station/${gtfsId}`);
    const data = await response.json();
    return data.station;
  }

  async function getArrivalsForStation(station) {
    const { gtfsStopId } = station;
    const response = await fetch(
      `http://localhost:3000/api/departures/${gtfsStopId}`
    );
    const data = await response.json();
    arrivals = data.arrivals;
  }

  function pickTrain(event) {
    selectedTrain = (event as CustomEvent<{ train: string }>).detail.train;
    getStationsForTrain(selectedTrain);
  }

  function pickStation(event) {
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
  <TrainPicker on:select={pickTrain} />
  {#if stations.length}
    <Stations {stations} train={selectedTrain} on:select={pickStation} />
  {:else}
    <p>Pick a train</p>
    <p class="disclaimer">
      Due to lag time in the MTA real-time feeds, information may not be
      accurate
    </p>
  {/if}
</main>
