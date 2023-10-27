<script lang="ts">


    import {SortingBar} from "$lib/components";
    import type {SortElement} from "$lib/models/SortElement";

    export let array: SortElement[] = [];
</script>

<div class="bar-container">
    {#each array as element, index (index)}
        <SortingBar {element} {index}/>
    {/each}
</div>

<style>
    .bar-container {
        gap: 5px;
        display: flex;
        flex-direction: row;
        align-items: flex-end;  /* Aligns items to the bottom */
        justify-content: space-evenly;  /* Distributes items evenly */
        width: 100%;
        height: 100%;
    }
</style>
