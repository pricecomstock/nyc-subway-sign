<script lang="typescript">
  export let train: string;
</script>

<style>
  img{
    height: 100%;
    width: auto;
  }

  .icon {
    height: 100%;
    vertical-align: middle;
    display: inline-block;
  }
</style>

<span class="icon">
  <img src={`/img/subway-icons/${train.toLowerCase()}.svg`} alt={`${train} icon`}>
</span>