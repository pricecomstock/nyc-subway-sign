<script lang="ts">
	import TrainPicker from "./components/TrainPicker.svelte"
	import Stations from "./components/Stations.svelte"
	import Arrivals from "./components/Arrivals.svelte"

	let selectedTrain = "";
	let selectedStation = {};
	let stations = [];
	let arrivals = [];

	async function getStationsForTrain(train) {
		const response = await fetch(`http://localhost:3000/api/stations/${train}`); // TODO make dynamic
		const data = await response.json();
		stations = data.stations;
	}

	async function getArrivalsForStation(station) {
		const { gtfsStopId } = station
		const response = await fetch(`http://localhost:3000/api/arrivals/${gtfsStopId}`); // TODO make dynamic
		const data = await response.json();
		arrivals = data.arrivals
	}

	function pickTrain (event) {
		selectedTrain = (event as CustomEvent<{train: string}>).detail.train;
		getStationsForTrain(selectedTrain);
	}

	function pickStation (event) {
		selectedStation = (event as CustomEvent<{station: string}>).detail.station;
		getArrivalsForStation(selectedStation);
	}
</script>

<main>
	<TrainPicker on:select={pickTrain}></TrainPicker> 
	<Arrivals {arrivals} station={selectedStation}></Arrivals>
	{#if stations.length}
		 <Stations {stations} train={selectedTrain} on:select={pickStation}></Stations>
	{:else}
		<p>Pick a train</p>
	{/if}
</main>

<style>
	div {
		height: 40px;
	}
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}
</style>