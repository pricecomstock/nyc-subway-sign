<script lang="ts">
  import TrainPicker from "./components/TrainPicker.svelte";
  import Arrivals from "./components/Arrivals.svelte";
  import StationTitle from "./components/StationTitle.svelte";
  import { onMount } from "svelte";
  import { calculateDistanceMiles } from "./helpers/utils";
  import StationPicker from "./components/StationPicker.svelte";
  import StationList from "./components/StationList.svelte";

  const NEARBY_STATES = {
    IDLE: 1,
    LOADING: 2,
    LOADED: 3,
    BLOCKED: 4,
  };

  let selectedTrain = "";
  let selectedStation = {};
  let stations = [];
  let arrivals = [];
  let isShowingTrainPicker = false;
  let nearbyStations = [];
  let nearbyState = NEARBY_STATES.IDLE;

  let identifier;
  let intervalId;

  $: nearbyButtonText = getNearbyButtonText(nearbyState);

  const baseUrl = __IS_DEVELOPMENT__
    ? "http://localhost:3000"
    : parent.location.origin;

  onMount(async () => {
    identifier = await getIdentifier();
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
      isShowingTrainPicker = false;
      const station = await getStationById(queryStation);
      selectedStation = station;
      await initializeForSelectedStation();
      setPageTitleForStations();
      setIconToTrain(selectedStation.trains[0]);
    } else {
      isShowingTrainPicker = true;
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
    const response = await fetch(`${baseUrl}/api/departures/${gtfsStopId}`, {
      headers: { identifier },
    });
    const data = await response.json();
    arrivals = data.arrivals;
  }

  async function getIdentifier() {
    const existingIdentifier = localStorage.getItem("identifier");
    if (existingIdentifier) {
      return existingIdentifier;
    }

    const response = await fetch(`${baseUrl}/api/identifier`, {
      method: "POST",
      body: JSON.stringify({
        referrer: document.referrer,
        details: {
          height: document.body.clientHeight,
          width: document.body.clientWidth,
        },
      }),
    });

    const { identifier = "" } = await response.json();
    localStorage.setItem("identifier", identifier);
    return identifier;
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
    if (!selectedTrain) {
      setIconToTrain(selectedStation.trains[0]);
    }
    isShowingTrainPicker = false;
    nearbyState = NEARBY_STATES.IDLE;
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
    await updateArrivalTimes();
    setUpdateEvery(30000);
  }

  async function updateArrivalTimes() {
    await getArrivalsForStation(selectedStation);
  }

  function setUpdateEvery(ms) {
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(updateArrivalTimes, ms);
  }

  function getNearby() {
    nearbyState = NEARBY_STATES.LOADING;
    isShowingTrainPicker = false;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // if user has switched to manual, don't override
        if (nearbyState !== NEARBY_STATES.LOADING) {
          return;
        }
        const response = await fetch(`${baseUrl}/api/stations`);
        const json = await response.json();
        const { stations: allStations = [] } = json;

        const { latitude, longitude } = position.coords;
        const distanceThresholdMiles = 0.7;

        nearbyStations = [];
        allStations.forEach((station) => {
          const distance = calculateDistanceMiles(
            latitude,
            longitude,
            station.gtfsLatitude,
            station.gtfsLongitude
          );
          if (distance < distanceThresholdMiles) {
            nearbyStations.push({
              ...station,
              distance: distance,
              distanceDisplay: `${distance.toFixed(2)}mi`,
            });
          }
        });
        nearbyStations.sort((a, b) => a.distance - b.distance);

        if (nearbyStations.length) {
          nearbyState = NEARBY_STATES.LOADED;
        } else {
          nearbyState = NEARBY_STATES.IDLE;
        }
      },
      () => {
        console.log("can't get location");
        nearbyState = NEARBY_STATES.BLOCKED;
      }
    );
  }

  function getNearbyButtonText(state) {
    switch (state) {
      case NEARBY_STATES.BLOCKED:
        return "gps blocked";

      case NEARBY_STATES.LOADING:
        return "loading...";

      case NEARBY_STATES.IDLE:
      case NEARBY_STATES.LOADED:
      default:
        return "nearby";
    }
  }
</script>

<main>
  <Arrivals {arrivals} station={selectedStation} />

  <div class="station-title-and-change-btn">
    <span>
      <StationTitle
        station={selectedStation}
        on:pickNewStation={() => {
          isShowingTrainPicker = true;
        }}
      />
    </span>
    <span>
      <button
        on:click={() => {
          isShowingTrainPicker = !isShowingTrainPicker;
          nearbyState = NEARBY_STATES.IDLE;
        }}>change</button
      >
      <button on:click={getNearby}>{nearbyButtonText}</button>
    </span>
  </div>
  <div class="footer">
    <p class="disclaimer">
      Due to lag time in the MTA real-time feeds, information may not be
      accurate. Location data is checked only when you request and is never sent
      to the server.
    </p>
  </div>
  {#if nearbyState === NEARBY_STATES.LOADING}
    <p>loading nearby stations...</p>
  {:else if nearbyState === NEARBY_STATES.LOADED}
    <div class="nearby-station-picker">
      <h2>Nearby Stations</h2>
      <StationList
        stations={nearbyStations}
        on:select={handlePickStationEvent}
        detailFields={["distanceDisplay"]}
      />
    </div>
  {:else if isShowingTrainPicker}
    <div class="train-station-picker">
      <TrainPicker on:select={handlePickTrainEvent} />
      {#if stations.length}
        <StationPicker
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

  .nearby-station-picker {
    width: min(60ch, 100%);
    margin: auto;
  }

  button {
    font-size: 0.7em;
  }
</style>
