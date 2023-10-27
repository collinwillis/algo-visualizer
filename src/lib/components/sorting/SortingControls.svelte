<script lang="ts">
    import {createEventDispatcher} from 'svelte';
    import {selectedAlgorithm, speed} from "$lib/store/sorting_store";

    const dispatch = createEventDispatcher();
    const onAlgorithmChange = (event: Event) => {
        selectedAlgorithm.set((event.target as HTMLSelectElement).value);
    };

    const sort = () => {
        dispatch('sort');  // or whichever sorting algorithm
    }

    const reset = () => {
        dispatch('reset');
    }

    const onSpeedChange = (event: Event) => {
        const value = (event.target as HTMLSelectElement).value;
        speed.set(Number(value));
    };
</script>

<div class="controls-container">
    <select on:change={onAlgorithmChange} class="algorithm-select">
        <option value={"bubbleSort"}>Bubble Sort</option>
        <option value={"selectionSort"}>Selection Sort</option>
        <option value={"quickSort"}>Quick Sort</option>
        <option value={"insertionSort"}>Insertion Sort</option>
        <option value={"mergeSort"}>Merge Sort</option>
        <option value={"heapSort"}>Heap Sort</option>
        <option value={"shellSort"}>Shell Sort</option>
        <option value={"combSort"}>Comb Sort</option>
        <option value={"countingSort"}>Counting Sort</option>
        <option value={"radixSort"}>Radix Sort</option>
        <option value={"bucketSort"}>Bucket Sort</option>
    </select>
    <select class="algorithm-select" on:change={onSpeedChange}>
        <option value="1000">Slow</option>
        <option value="400">Default</option>
        <option value="250">Fast</option>
        <option value="0">Real Time</option>
    </select>
    <button on:click={sort}>Sort</button>
    <button on:click={reset}>Reset</button>
</div>

<style>
    .controls-container {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }

    .speed-control {
        display: flex;
        align-items: center;
    }

    .algorithm-select {
        width: 200px;
        padding: 10px;
        font-size: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        appearance: none;
        background-color: #ffffff;
        cursor: pointer;
    }

    button {
        padding: 10px 20px;
        background-color: #3498db;
        border: none;
        border-radius: 25px;
        color: white;
        font-size: 16px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s ease, transform 0.1s ease;
    }

    button:hover {
        background-color: #2c8ad1;
        transform: translateY(-2px);
    }

    button:active {
        transform: translateY(0);
    }
</style>
