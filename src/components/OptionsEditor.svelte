<script lang="ts">
  import { DisplayOptions } from "../DisplaySpec";

  export let options: DisplayOptions = new DisplayOptions();
</script>

<div>
  <div>
    Soonest Departure to Show (minutes):
    <input
      type="number"
      name=""
      id=""
      bind:value={options.soonestTrainArrivalMinutes}
    />
  </div>
  <div>
    Latest Departure to Show (minutes):
    <input
      type="number"
      name=""
      id=""
      bind:value={options.latestTrainArrivalMinutes}
    />
  </div>
</div>

<style>
  /* your styles go here */
</style>
