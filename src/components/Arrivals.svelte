<script lang="typescript">
  import Arrival from "./Arrival.svelte";
  import { DisplayOptions } from "../DisplaySpec";
  export let arrivals = [];
  export let station = {};
  export let options = new DisplayOptions();

  function stationHasDirection(direction) {
    return direction === "N"
      ? station.northDirectionLabel !== ""
      : station.southDirectionLabel !== "";
  }

  $: trains = [...new Set(arrivals.map(({ train }) => train))];

  $: trainDirections = trains.flatMap((train) => [
    { train, direction: "S" },
    { train, direction: "N" },
  ]);

  $: filteredArrivals = arrivals.filter((arrival) => {
    const matchingHiddenTrainDirection = options.hiddenTrainDirections.some(
      (trainDirection) => {
        return (
          trainDirection.train === arrival.train &&
          trainDirection.direction === arrival.direction
        );
      }
    );
    const arrivalMs = arrival.timestamp * 1000 - Date.now();
    const keep =
      arrivalMs > options.soonestTrainArrivalMinutes * 60000 &&
      arrivalMs < options.latestTrainArrivalMinutes * 60000 &&
      !matchingHiddenTrainDirection;
    return keep;
  });

  $: arrivalsByTrainDirections = new Map(
    trainDirections.map((trainDirection) => {
      return [
        trainDirection,
        filteredArrivals
          .filter((arrival) => {
            return (
              arrival.direction === trainDirection.direction &&
              arrival.train === trainDirection.train
            );
          })
          .slice(0, options.maxArrivalsPerTrainDirection),
      ];
    })
  );

  // $: console.log("arrivals", arrivals);
  $: relevantArrivals = [...arrivalsByTrainDirections.values()]
    .flat()
    .filter((arrival) => stationHasDirection(arrival.direction))
    .sort((a, b) => a.timestamp - b.timestamp)
    .slice(0, options.maxArrivals);
</script>

<div>
  {#each relevantArrivals as arrival}
    <div class="arrival-container">
      <Arrival {arrival} {station} />
    </div>
  {/each}
</div>

<style>
  /* your styles go here */
  .arrival-container {
    border-bottom: #888 2px solid;
    padding: 8px 0;
  }
</style>
