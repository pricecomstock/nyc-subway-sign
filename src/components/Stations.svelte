<script lang="typescript">
  const boroughNames = {
    bk: "Brooklyn",
    m: "Manhattan",
    bx: "Bronx",
    q: "Queens",
    si: "Staten Island",
  };

  // For ordering boroughs vaguely geographically
  const boroughOrder = {
    bx: 0,
    m: 1,
    bk: 2,
    q: 3,
    si: 3,
  };

  import { getTrainColor } from "../helpers/color";
  import TrainIcon from "./TrainIcon.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let train = "";
  export let stations = [];

  let selectedIndex = -1;

  $: selectedStation = stations[selectedIndex];
  $: {
    document.documentElement.style.setProperty(
      "--selected-train-color",
      `var(${getTrainColor(train)})`
    );
  }
  $: stationsByBorough = [
    ...stations
      .reduce((boroughMap, station) => {
        const normalizedBorough = station.borough.toLowerCase();
        const stationsForBorough = boroughMap.get(normalizedBorough) ?? [];
        stationsForBorough.push(station);
        boroughMap.set(normalizedBorough, stationsForBorough);
        return boroughMap;
      }, new Map())
      .entries(),
  ].sort((a, b) => {
    return boroughOrder[a[0]] - boroughOrder[b[0]];
  });

  function selectStation(station) {
    dispatch("select", {
      station,
    });
  }
</script>

<div class="station-picker">
  {#if stations}
    <div class="selected-train-title">
      <TrainIcon {train} size="1em" /> Stations
    </div>
    <div class="boroughs-list-container">
      {#each stationsByBorough as [borough, stationGroup]}
        <div class="stations-list">
          <h2 class="borough-name">{boroughNames[borough]}</h2>
          {#each stationGroup as station, i}
            <div on:click={() => selectStation(station)} class="station-button">
              <div class="station-select-icon-group">
                {#each station.trains as stationTrain}
                  <TrainIcon train={stationTrain} size="1.2rem" />
                {/each}
              </div>
              <div class="station-name">
                <p>{station.stopName}</p>
              </div>
            </div>
          {/each}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
  .train-select-icon {
    margin-right: 0.5rem;
  }

  .selected-train-title {
    text-align: center;
    margin: auto;
    font-size: 2rem;
    font-weight: bold;
  }

  div.station-picker {
    margin: auto;
  }
  .boroughs-list-container {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .stations-list {
    text-align: left;
    width: min(50ch, 100%);
    margin: 0 0.5rem;
  }

  .station-button:first-of-type {
    border-top: 1px solid #aaa;
  }

  .station-button {
    padding: 0.1rem 0;
    border-bottom: 1px solid #aaa;
    font-size: 1.2rem;

    display: flex;

    cursor: pointer;
    transition: color 0.2s;
    transition: border-width 0.2s;
    transition: margin 0.2s;
  }
  .station-select-icon-group {
    display: inline-block;
    width: max(8ch, 15%);
    flex-basis: 8ch;
    flex-shrink: 1;
    margin-right: 0.5rem;
    text-align: right;
  }

  .station-name {
    display: inline-block;
    overflow-wrap: break-word;
  }

  .station-name > p {
    margin: 0;
    padding: 0;
  }

  .station-button:nth-child(odd) {
  }

  .station-button:hover {
    background: #fafafa;
    /* color: var(--selected-train-color); */
    border-right: 5px solid var(--selected-train-color);
    font-weight: bold;
    text-decoration-style: wavy;
  }
</style>
