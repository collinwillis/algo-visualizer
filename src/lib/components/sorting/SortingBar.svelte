<script lang="ts">

    import type {SortElement} from "$lib/models/SortElement";
    import {speed} from "$lib/store/sorting_store";

    $: {
        // Use the $ prefix to access the current value of the speed store
        if (typeof window !== 'undefined') {  // Check if running on the client-side
            document.documentElement.style.setProperty('--transition-duration', `${$speed}ms`);
        }
    }

    export let element: SortElement;
    export let index: number;


</script>

<div class="bar" style="height: {element.value * 10}px; background-color: {element.color};">
    <span class="bar-value">{element.value}</span>
    <span class="index">{index}</span>
</div>

<style>

    .bar {
        font-family: 'Arial', sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        flex: 1;
        transform: translateZ(0);
        transition-delay: 50ms;
        background-color: #2c3e50;
        transition: height var(--transition-duration) ease, background-color var(--transition-duration) ease;
        border-radius: 5px 5px 0 0;
        padding: 5px;
        box-sizing: border-box;
    }

    .bar-value {
        color: #fff;
        font-size: 20px;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        z-index: 1;
    }

    .index {
        position: absolute;
        bottom: -25px;
        width: 100%;
        text-align: center;
        font-size: 18px;
        color: #7f8c8d;
    }
</style>
