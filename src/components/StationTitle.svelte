<script>
  import TrainIcon from "./TrainIcon.svelte";
  export let station = {};
</script>

{#if station.stopName}
  <div class="station-title">
    {#each station.trains as train}
      <span><TrainIcon {train} size="max(4vmin, 1.3rem)" /></span>
    {/each}
    <h1>{station.stopName}</h1>
  </div>
{/if}

<style>
  .station-title {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .station-title span {
    margin: 0 0.1rem;
  }
  .station-title h1 {
    font-size: max(1.25em, 3vmin);
    margin: 0 1vw;
  }
</style>
