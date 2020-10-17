<script lang="typescript">
  import Arrival from "./Arrival.svelte";
  export let arrivals = [];
  export let station = {};

  // $: trains = new Set(arrivals.map((arrival) => arrival.train))
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
</style>


{#each arrivals as arrival}
   <Arrival {arrival} {station}></Arrival>
{/each}
