<script lang="ts">
    import Bar from './Bar.svelte';
    import type {VisualElement} from "$lib/utilities/types";
    export let array: VisualElement[] = [];
</script>

<div class="bar-container">
    {#each array as element, index (index)}
        <Bar {element} {index}/>
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
``
