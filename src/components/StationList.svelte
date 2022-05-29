<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

  export let stations = [];

  function selectStation(station) {
    dispatch("select", {
      station,
    });
  }
</script>

<div class="stations-list">
  {#each stations as station, i}
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
    width: 100%;
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
