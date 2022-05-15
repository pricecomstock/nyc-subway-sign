<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte";
  export let arrival = {};
  export let station = {};

  let debug = false;

  let currentMs = Date.now();
  const arrivingThresholdMs = -20000;

  setInterval(() => {
    currentMs = Date.now();
  }, 5000);

  function displayMinutesFromMs(ms: number) {
    return Math.max(Math.round(ms / 60000), 0);
  }

  function toggleDebug() {
    debug = !debug;
  }

  const defaultStationLabel =
    arrival.direction === "N"
      ? station.northDirectionLabel || "End of line"
      : station.southDirectionLabel || "End of line";

  $: arrivalTimestamp = arrival.timestamp * 1000;
  $: arrivalTimeHHMMSS = new Date(arrivalTimestamp).toLocaleTimeString("en-us");
  $: directionLabel = arrival.directionName || defaultStationLabel;
  $: msRemaining = arrivalTimestamp - currentMs;
  $: minutesRemaining = displayMinutesFromMs(msRemaining);
  $: isArrivingSoon = msRemaining < arrivingThresholdMs;
</script>

{#if arrival.timestamp && station.gtfsStopId}
  <div class="arrival" class:arriving={isArrivingSoon} on:click={toggleDebug}>
    <!-- <div class="train-icon"> -->
    <TrainIcon train={arrival.train} size="min(5.5vmax, 8rem)" />
    <!-- </div> -->
    <div class="direction-label">{directionLabel}</div>
    {#if debug}
      <div class="eta">
        <div class="debug">
          <span class="debug-bold">{minutesRemaining} min</span> ({(
            msRemaining / 1000
          ).toFixed(0)}s)
          <br />
          {arrivalTimeHHMMSS}
        </div>
      </div>
    {:else}
      <div class="eta">
        {minutesRemaining} min
      </div>
    {/if}
  </div>
{/if}

<style>
  .arrival {
    display: flex;
    align-items: center;
    justify-content: stretch;
    font-weight: bold;
    font-size: max(3vw, 1.5em);
  }

  .train-icon {
    flex: 0 1;
    align-self: baseline;
  }

  .small-eta {
  }

  .direction-label {
    flex: 1 0;
    text-align: left;
    padding-left: 2vw;
    /* overflow: hidden;
    white-space: nowrap; */
  }

  .debug-bold {
    font-weight: bold;
    color: #333;
  }

  .eta {
    flex: 0 1 7ch;
    text-align: right;
  }

  .debug {
    font-size: 0.5em;
    margin-left: 0.3rem;
    font-weight: normal;
    color: #888;
  }

  @keyframes arrivingFlash {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
    }
  }
  .arriving {
    animation: arrivingFlash 1s ease-in infinite alternate;
  }
</style>
