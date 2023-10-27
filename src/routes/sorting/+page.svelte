<script lang="ts">
    import {getVisualizer} from '$lib/utilities/visualization_service';
    import {SortingControls, SortingVisualizer} from "$lib/components";
    import {selectedAlgorithm, speed} from "$lib/store/sorting_store";
    import {get} from "svelte/store";
    import {createSortElementList, SortElement} from "$lib/models/SortElement";

    const initialArray: SortElement[] = createSortElementList(10);
    let array: SortElement[] = [...initialArray];
    let processing = false;

    const handleReset = () => {
        array = createSortElementList(10);
    }

    const handleSort = async (): Promise<void> => {
        let algo = get(selectedAlgorithm);
        let algoSpeed = get(speed);
        if(processing == true) return;
        processing = true;
        const visualizerFunction = getVisualizer(algo);
        const visualizer = visualizerFunction(array, (updatedArray) => {
            array = updatedArray;
        });
        await algo(array, algoSpeed, visualizer);
        processing = false;
    }

</script>

<div id="page-container">
    <header>
        <h1>Sorting Visualizer</h1>
        <p>Explore how different sorting algorithms work</p>
    </header>

    <div id="visualizer-container">
        <div id="controls-container"><SortingControls on:sort={handleSort} on:reset={handleReset} /></div>
        <SortingVisualizer {array}/>
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

