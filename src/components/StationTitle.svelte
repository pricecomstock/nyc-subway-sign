<script>
  import TrainIcon from "./TrainIcon.svelte";
  export let station = {};
</script>

<style>
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
