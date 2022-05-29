<script lang="typescript">
  import StationList from "./StationList.svelte";

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

  export let train = "";
  export let stations = [];

  // Set document CSS variable for selected train color
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
</script>

<div class="station-picker">
  {#if stations}
    <div class="selected-train-title">
      <TrainIcon {train} size="1em" /> Stations
    </div>
    <div class="boroughs-list-container">
      {#each stationsByBorough as [borough, stationGroup]}
        <div class="borough-list">
          <h2 class="borough-name">{boroughNames[borough]}</h2>
          <StationList stations={stationGroup} on:select />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
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
  .borough-list {
    width: min(50ch, 100%);
    margin: 0 0.5rem;
  }
</style>
