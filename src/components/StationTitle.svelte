<script>
  import TrainIcon from "./TrainIcon.svelte";
  export let station = {};
</script>

{#if station.stopName}
  <div class="station-title">
    {#each station.trains as train}
      <span><TrainIcon {train} size="2rem" /></span>
    {/each}
    <h1>{station.stopName}</h1>
  </div>
{/if}

<style>
  .station-title {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 0;
  }

  .station-title span {
    margin: 0 0.1rem;
  }
  .station-title h1 {
    font-size: 1.5rem;
    margin: 0 0.5rem;
  }
</style>
