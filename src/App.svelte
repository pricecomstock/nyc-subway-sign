<script lang="ts">
	import TrainIcon from "./components/TrainIcon.svelte"
	import TrainPicker from "./components/TrainPicker.svelte"

	let train = ""

	function pickTrain (event) {
		train = (event as CustomEvent<{train: string}>).detail.train;
	}
</script>

<main>
	<TrainPicker on:select={pickTrain}></TrainPicker>
	<div>
		Better take the <TrainIcon {train}></TrainIcon>
	</div>
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