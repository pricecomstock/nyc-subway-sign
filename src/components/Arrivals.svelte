<script lang="typescript">
  import Arrival from "./Arrival.svelte";
  export let arrivals = [];
  export let station = {};
  export let options = {
    maxArrivals: 10,
  };

  const numArrivalsPerTrainDirection = 2;

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
  // Map {train, direction} ==> Arrival[]
  $: arrivalsByTrainDirections = new Map(
    trainDirections.map((trainDirection) => {
      console.log("trainDirection", trainDirection);
      return [
        trainDirection,
        arrivals
          .filter((arrival) => {
            return (
              arrival.direction === trainDirection.direction &&
              arrival.train === trainDirection.train
            );
          })
          .slice(0, numArrivalsPerTrainDirection), // Limit to 2 for each train direction
      ];
    })
  );

  $: console.log("ABTD", arrivalsByTrainDirections);
  // $: arrivalsByTrain = [...trainDirections].map((trainDirection) => {
  //   return arrivals.filter((arrival) => arrival.train === train);
  // });
  // $: arrivalsByTrainByDirection = arrivalsByTrain.map((arrivalList) => {
  //   return arrivalList
  // })
  // $: relevantArrivals = arrivals
  $: relevantArrivals = [...arrivalsByTrainDirections.values()]
    .flat()
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
</style>

<div>
  {#each relevantArrivals as arrival}
    <div class="arrival-container">
      <Arrival {arrival} {station} />
    </div>
  {/each}
</div>
<!-- {#each [...arrivalsByTrainDirections.values()] as abt}
  {JSON.stringify(abt)}
{/each} -->
<!-- {#each relevantArrivals as rArrival}
   <p>{rArrival.stationDirection} - {rArrival.train}: {(rArrival.timestamp - Date.now()/1000).toFixed()}</p>
{/each} -->
