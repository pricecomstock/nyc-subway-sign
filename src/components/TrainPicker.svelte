<script lang="typescript">
  import TrainIcon from "./TrainIcon.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const trainGroups = [
    ["A", "C", "E"],
    ["B", "D", "F", "M"],
    ["G"],
    ["J", "Z"],
    ["L"],
    ["N", "Q", "R", "W"],
    ["S"],
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7"],
  ];

  let selected = "";

  function select(train: string) {
    selected = train;
    dispatch("select", {
      train,
    });
  }
</script>

<div class="container">
  {#each trainGroups as trainGroup}
    <div class="train-group">
      {#each trainGroup as train, i}
        <div on:click={() => select(train)} class="option">
          <TrainIcon {train} size="max(6vmin, 3rem)" />
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .container {
    overflow: wrap;
    padding: 0.5rem 0;
  }

  .train-group {
    display: inline-block;
    padding: 0 0.5rem;
  }

  .option {
    display: inline-block;
    padding: 0 1px;
    height: 100%;
    cursor: pointer;
  }
</style>
