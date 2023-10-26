<script lang="ts">
    import {getVisualizer} from '$lib/utilities/visualization_service';
    import Visualizer from '$lib/components/sorting/visualizer.svelte';
    import Controls from '$lib/components/sorting/controls.svelte';
    import type {VisualElement} from "$lib/utilities/types";
    import {selectedAlgorithm, speed} from "$lib/store/sorting_store";
    import {get} from "svelte/store";

    let initialArray: VisualElement[] = [34, 7, 23, 32, 5, 62, 4, 22, 56, 32, 23,66].map(value => ({value, color: '#3498db'}));
    let array: VisualElement[] = [...initialArray];
    let processing = false;

    const handleReset = () => {
        array = [...initialArray];
    }

    const handleSort = async (): Promise<void> => {
        let algo = get(selectedAlgorithm);
        let algoSpeed = get(speed);
        if(processing == true) return;
        processing = true;
        const visualizerFunction = getVisualizer(algo);
        const numberArray = array.map(item => item.value);
        const visualizer = visualizerFunction(numberArray, (updatedArray) => {
            array = updatedArray;
        });
        await algo(numberArray, algoSpeed, visualizer);
        processing = false;
    }

</script>

<div id="page-container">
    <header>
        <h1>Sorting Visualizer</h1>
        <p>Explore how different sorting algorithms work</p>
    </header>

    <div id="visualizer-container">
        <div id="controls-container"><Controls on:sort={handleSort} on:reset={handleReset} /></div>
        <Visualizer {array}/>
    </div>

</div>

<style>
    #page-container {
        font-family: 'Roboto', sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #fafafa;
    }

    header {
        text-align: center;
        margin-bottom: 1rem;
    }

    h1 {
        font-size: 2.5rem;
        margin: 0;
        color: #2c3e50;
    }

    p {
        color: #7f8c8d;
    }

    #visualizer-container {
        max-width: 95%;  /* Set a maximum width */
        width: 100%;

        padding: 20px;
        background: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Add shadow for a floating effect */
        margin: auto;  /* Center horizontally */
    }

    #controls-container {
        align-self: start /* Center horizontally */
    }

</style>

