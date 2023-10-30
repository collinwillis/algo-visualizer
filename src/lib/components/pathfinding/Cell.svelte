<script lang="ts">
    import './Cell.css';

    export let isEnd;
    export let isStart;
    export let isWall;
    export let row;
    export let col;
    export let onMouseDown;
    export let onMouseEnter;
    export let onMouseUp;
    export let isLastRow;
    export let isLastCol;
    export let isFirstRow;
    export let isFirstCol;


</script>

<style>
    /* Import or include your CSS from Node.css here. */
</style>

<div
        on:dragstart={e => e.preventDefault()}
        draggable="true"
        role="button"
        tabindex="0"
        aria-label="Node interaction"
        id={`node-${row}-${col}`}
        class="node"
        class:node-finish={isEnd}
        class:node-start={isStart}
        class:node-wall={isWall}
        class:last-col={isLastCol}
        class:last-row={isLastRow}
        class:first-col={isFirstCol}
        class:first-row={isFirstRow}
        on:mousedown={(event) => onMouseDown(row, col, event)}
        on:mouseenter={() => onMouseEnter(row, col)}
        on:mouseup={onMouseUp}
></div>

