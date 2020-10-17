<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte"
  export let arrival = {};
  export let station = {};

  function roundedMinutesFromMs(ms: number) {
    return Math.round(ms / 60000);
  }

  console.log("Arrival", arrival)
  console.log("Station", station)
  $: directionLabel = arrival.direction === "N" ? station.northDirectionLabel || "End of line" : station.southDirectionLabel || "End of line"
  $: minutesRemaining = roundedMinutesFromMs(new Date(arrival.timestamp * 1000) - Date.now());
</script>

<style>
  .arrival {
    display: flex;
    align-items: center;
    justify-content: stretch;
    font-size: 3em;
    font-weight: bold;

    border-top: #888 2px solid;
    padding-top: 10px;
  }

  .train-icon {
    flex: 0 1;
    align-self: baseline;
  }
  
  .direction-label {
    flex: 1 0;
    text-align: left;
    padding-left: 1rem;
  }
  
  .eta {
    flex: 0 1 7ch;
    text-align: right;
  }
</style>

{#if arrival.timestamp && station.gtfsStopId}
   <div class="arrival">
     <div class="train-icon">
       <TrainIcon train={arrival.train} size="2em"></TrainIcon>
     </div>
     <div class="direction-label">
       {directionLabel}
     </div>
     <div class="eta">{minutesRemaining} min</div>
   </div>
{/if}