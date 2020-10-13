<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte"
  import {createEventDispatcher} from "svelte";

  const dispatch = createEventDispatcher();

  const trains = ["A", "C", "E", "B", "D", "F", "M", "G", "J", "Z", "L", "N", "Q", "R", "S", "1", "2", "3", "4", "5", "6", "7" ]
  
  let selected = ""

  function select(train: string) {
    selected = train;
    dispatch("select", {
      train
    })
  }
</script>
  
<style>
  .container {
    overflow: wrap;
    height: 30px;
    padding: 0.5rem 0;
  }

  .option {
    display: inline-block;
    padding: 0 1px;
    height: 100%;
    cursor: pointer;
  }
</style>
  
<div class="container">
  {#each trains as train, i}
    <div on:click={() => select(train)} class="option"><TrainIcon train={train}></TrainIcon></div>
  {/each}
</div>