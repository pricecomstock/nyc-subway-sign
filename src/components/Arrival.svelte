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
    console.log("Toggle Debug");
    debug = !debug;
  }

  console.log("Arrival", arrival);
  console.log("Station", station);

  let defaultStationLabel =
    arrival.direction === "N"
      ? station.northDirectionLabel || "End of line"
      : station.southDirectionLabel || "End of line";

  $: arrivalTimestamp = arrival.timestamp * 1000;
  $: directionLabel = arrival.directionName || defaultStationLabel;
  $: msRemaining = arrivalTimestamp - currentMs;
  $: minutesRemaining = displayMinutesFromMs(msRemaining);
  $: isArrivingSoon = msRemaining < arrivingThresholdMs;
</script>

{#if arrival.timestamp && station.gtfsStopId}
  <div class="arrival" class:arriving={isArrivingSoon} on:click={toggleDebug}>
    <!-- <div class="train-icon"> -->
    <TrainIcon train={arrival.train} size="min(12vmin, 1.8em)" />
    <!-- </div> -->
    <div class="direction-label">{directionLabel}</div>
    <div class="eta">{minutesRemaining} min</div>
    {#if debug}
      <div class="debug">
        {new Date(arrivalTimestamp).toLocaleTimeString("en-US")}
        <br />
        in {(msRemaining / 1000).toFixed(0)} sec
        <br />
        <!-- {arrival.tripId} -->
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

  .direction-label {
    flex: 1 0;
    text-align: left;
    padding-left: 2vw;
    /* overflow: hidden;
    white-space: nowrap; */
  }

  .eta {
    flex: 0 1 7ch;
    text-align: right;
  }

  .debug {
    font-size: 0.5em;
    margin-left: 0.3rem;
    text-align: left;
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
