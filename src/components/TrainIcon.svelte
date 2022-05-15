<script lang="typescript">
  export let train: string;
  export let size: string;

  function iconFromTrain(trainName) {
    // All shuttles use same icon, but are labeled GS, or FS
    if (trainName.length > 1 && /s$/i.test(trainName)) return "s";

    return trainName.toLowerCase();
  }

  $: icon = iconFromTrain(train);
</script>

<span class="icon" style={`height: ${size}; width: ${size}`}>
  {#if train}
    <img src={`/img/subway-icons/${icon}.svg`} alt={`${train}`} />
  {/if}
</span>

<style>
  img {
    height: 100%;
    width: auto;
  }

  .icon {
    display: inline-block;
  }
</style>
