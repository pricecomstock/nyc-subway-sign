<script lang="ts">
  import TrainPicker from "./components/TrainPicker.svelte";
  import Stations from "./components/Stations.svelte";
  import Arrivals from "./components/Arrivals.svelte";
  import StationTitle from "./components/StationTitle.svelte";
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
    url.searchParams.set("s", selectedStation.gtfsStopId);

    window.history.replaceState(
      { page: 1 },
      `NYC Subway Sign - ${selectedStation}`,
      `?${url.searchParams.toString()}`
    );
  }

  async function loadFromUrlParams() {
    const query = new URLSearchParams(parent.location.search);
    const queryStation = query.get("s") || query.get("station"); // idk if anyone bookmarked it before 5/17/22
    if (queryStation) {
      showTrainPicker = false;
      const station = await getStationById(queryStation);
      selectedStation = station;
      await initializeForSelectedStation();
      setPageTitleForStations();
      setIconToTrain(selectedStation.trains[0]);
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
    setIconToTrain(selectedTrain);
    getStationsForTrain(selectedTrain);
  }

  function handlePickStationEvent(event) {
    selectedStation = (event as CustomEvent<{ station: string }>).detail
      .station;
    writeUrlParams();
    initializeForSelectedStation();
    setPageTitleForStations();
    showTrainPicker = false;
  }

  function setPageTitleForStations() {
    document.title = `${selectedStation.stopName} - whentrain.nyc`;
  }

  function setIconToTrain(train) {
    let faviconLink = document.querySelector("link[rel~='icon']");
    if (!faviconLink) {
      faviconLink = document.createElement("link");
      faviconLink.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(faviconLink);
    }

    faviconLink.href = `/img/subway-icons/${train.toLowerCase()}.svg`;
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
  <div class="footer">
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

  .station-title-and-change-btn {
    display: inline-flex;
    align-items: center;
    flex: 1 0 70%;
    align-self: left;
    padding: max(0.5rem, 2vh) 0;
  }

  .disclaimer {
    align-self: center;
    flex-shrink: 1;
    font-size: 0.75rem;
    color: var(--mta-s);
    margin: auto;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  button {
    font-size: 0.7em;
  }
</style>
