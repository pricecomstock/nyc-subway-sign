<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte";
  import Arrival from "./Arrival.svelte";
  export let arrivals = [];
  export let station = {};

  function stationHasDirection(direction) {
    return direction === "N"
      ? station.northDirectionLabel !== ""
      : station.southDirectionLabel !== "";
  }

  // $: trains = new Set(arrivals.map((arrival) => arrival.train));
  // $: arrivalsByTrain = [...trains].map((train) => {
  //   return arrivals.filter((arrival) => arrival.train === train)
  // })
  // $: arrivalsByTrainByDirection = arrivalsByTrain.map((arrivalList) => {
  //   return arrivalList
  // })
  $: relevantArrivals = arrivals
    .filter((arrival) => stationHasDirection(arrival.direction))
    .sort((a, b) => a.timestamp - b.timestamp);
  // $: relevantArrivals =
  // [...trains].map((train) => {
  //   return arrivals
  //   // get arrivals for train
  //   .filter((arrival) => arrival.train === train)
  //   // Get first 2 arrivals in each direction for train
  //   .flatMap(arrival => [
  //   ...arrivals.filter(({direction}) => direction === "S").slice(0,2),
  //   ...arrivals.filter(({direction}) => direction === "N").slice(0,2)
  // ]
  // })
  // .sort((a, b) => a.timestamp - b.timestamp)
</script>

<style>
  /* your styles go here */
  .arrival-container {
    border-top: #888 2px solid;
    padding-top: 10px;
  }

  .arrival-container:last-child {
    border-bottom: #888 2px solid;
  }

  .station-title {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem 0;
  }

  .station-title span {
    margin: 0 0.1rem;
  }
  .station-title h1 {
    font-size: 3rem;
    margin: 0 0.5rem;
  }
</style>

{#if station.stopName}
  <div class="station-title">
    {#each station.trains as train}
      <span><TrainIcon {train} size="2.5rem" /></span>
    {/each}
    <h1>{station.stopName}</h1>
  </div>
{/if}
{#each relevantArrivals as arrival}
  <div class="arrival-container">
    <Arrival {arrival} {station} />
  </div>
{/each}
<!-- {#each arrivalsByTrainByDirection as abt}
  {JSON.stringify(abt)}
{/each} -->
<!-- {#each relevantArrivals as rArrival}
   <p>{rArrival.stationDirection} - {rArrival.train}: {(rArrival.timestamp - Date.now()/1000).toFixed()}</p>
{/each} -->
