<script lang="typescript">
  import { getTrainColorFGClass } from "../helpers/color"
	import TrainIcon from "./TrainIcon.svelte"
  
  import {createEventDispatcher} from "svelte";
  const dispatch = createEventDispatcher();

  export let train = "";
  export let stations = []

  let selectedIndex = -1;

  $: selectedStation = stations[selectedIndex];
  $: trainColorClass = getTrainColorFGClass(train)

  function selectIndex(index: number) {
    selectedIndex = index;
    dispatch("select", {
      station: stations[selectedIndex]
    })
  }
</script>

<style>
  .icon {
    margin-right: 0.5rem;
  }

  h1 {
    display: flex;
    align-items: center;
  }

  div {
    max-width: 30ch;
    margin: auto;
  }
	.stations-list {
    text-align: left;
  }
  li {
    cursor: pointer;
    transition: color 0.2s;
  }
  li:not(:hover) {
    color: black !important;
  }
</style>

  
<div>
  {#if stations}
  <h1>
    <span class="icon"><TrainIcon {train} size="50px"></TrainIcon></span> Stations
  </h1>
  <ul class="stations-list">
    {#each stations as station, i}
    <li on:click={() => selectIndex(i)} class={`${trainColorClass}`}>
      {station.stopName}
    </li>
    {/each}
  </ul>
  {/if}
</div>