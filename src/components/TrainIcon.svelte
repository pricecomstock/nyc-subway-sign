<script lang="typescript">
  export let train: string;
  export let size: string;
</script>

<style>
  img{
    height: 100%;
    width: auto;
  }

  .icon {
    display: inline-block;
  }
</style>

<span class="icon" style={`height: ${size}; width: ${size}`}>
  {#if train}
     <img src={`/img/subway-icons/${train.toLowerCase()}.svg`} alt={`${train} icon`}>
  {/if}
</span>