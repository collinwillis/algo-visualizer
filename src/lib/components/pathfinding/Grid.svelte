<script lang="ts">
    import {onMount, tick} from "svelte";
    import {GridCell} from "$lib/models/GridCell.ts";
    import {dijkstrasAlgorithm} from "$lib/algorithms/pathfinding.ts";
    import {fade, scale} from 'svelte/transition';

    let grid: GridCell[][] = [];
    const GRID_SIZE = 20;
    let draggingWall = false;
    let draggingStart = false;
    let draggingEnd = false;

    const DEFAULT_START = { row: 5, col: 5 };
    const DEFAULT_END = { row: 15, col: 15 };

    onMount(() => {
        for (let i = 0; i < GRID_SIZE; i++) {
            let row = [];
            for (let j = 0; j < GRID_SIZE; j++) {
                let cell = new GridCell(i, j);
                if (i === DEFAULT_START.row && j === DEFAULT_START.col) {
                    cell.isStart = true;
                } else if (i === DEFAULT_END.row && j === DEFAULT_END.col) {
                    cell.isEnd = true;
                }
                row.push(cell);
            }
            grid.push(row);
        }
        grid = [...grid];

        const globalMouseUpHandler = () => {
            draggingWall = false;
            draggingStart = false;
            draggingEnd = false;
            grid = [...grid];  // Update grid to reflect changes.
        };
        document.addEventListener('mouseup', globalMouseUpHandler);

        return () => {
            // Cleanup: Remove the global listener when the component is destroyed.
            document.removeEventListener('mouseup', globalMouseUpHandler);
        };
    });

    const startPathfinding = async () => {
        let startCell, endCell;
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (grid[i][j].isStart) startCell = grid[i][j];
                if (grid[i][j].isEnd) endCell = grid[i][j];
            }
        }

        if (!startCell || !endCell) {
            alert('Please ensure both a start and end position are present.');
            return;
        }

        await dijkstrasAlgorithm(grid, startCell.row, startCell.col, endCell.row, endCell.col, 10, (updatedGrid) => {
            grid = updatedGrid;
        });
    };

    const handleCellEnter = (cell: GridCell) => {
        if (draggingWall) {
            cell.isWall = true;
        } else if (draggingStart) {
            grid.forEach(row => row.forEach(c => c.isStart = false));  // Clear previous start
            cell.isStart = true;
        } else if (draggingEnd) {
            grid.forEach(row => row.forEach(c => c.isEnd = false));    // Clear previous end
            cell.isEnd = true;
        }
        grid = [...grid];
    };

    const handleMouseLeave = () => {
        draggingWall = false;
        draggingStart = false;
        draggingEnd = false;
    };

    const handleMouseDown = (cell: GridCell) => {
        if (cell.isStart) {
            draggingStart = true;
        } else if (cell.isEnd) {
            draggingEnd = true;
        } else if (!draggingStart && !draggingEnd) {
            draggingWall = true;
            cell.isWall = !cell.isWall;
        }
        grid = [...grid];
    };

    const handleMouseUp = () => {
        draggingWall = false;
        draggingStart = false;
        draggingEnd = false;
    };

    async function fadeScale(node, params) {
        await tick(); // wait for the next micro-task
        fade(node, params);
        scale(node, params);
    }

    function computeCellClass(cell: GridCell) {
        let classes = ["cell"];
        if (cell.isWall) classes.push("isWall");
        if (cell.isVisited) classes.push("isVisited");
        if (cell.isPath) classes.push("isPath");
        if (cell.isStart) classes.push("isStart");
        if (cell.isEnd) classes.push("isEnd");
        return classes.join(" ");
    }
</script>

<div class="container">
<div class="grid" on:mouseleave={handleMouseLeave} role="group">
    {#each grid as row, rowIndex}
        {#each row as cell, colIndex}
            <div
                    role="button"
                    tabindex="0"
                    class="{computeCellClass(cell)} row-{rowIndex} col-{colIndex}"
                    on:keydown={(event) => {if (event.key === 'Enter' || event.key === ' ') {event.preventDefault();}}}
                    on:mousedown={() => handleMouseDown(cell)}
                    on:mouseup={handleMouseUp}
                    on:mouseenter={() => handleCellEnter(cell)}
                    in:fadeScale={{ duration: 500 }}
            ></div>
        {/each}
    {/each}
</div>
</div>

<button on:click={startPathfinding} in:fade={{ duration: 500 }}>Start Pathfinding</button>

<style>
    :root {
        --grid-size: 20;
        --container-size: 90vh;  /* Using viewport height for this example */
        --cell-size: calc(var(--container-size) / var(--grid-size));
    }

    .container {
        font-family: 'Arial', sans-serif;
        background-color: #f7f7f7;
        display: flex;
        justify-content: center;
        align-items: center;  /* This centers the grid vertically */
        min-height: 100vh;
    }

    .grid {

        display: grid;
        grid-template-columns: repeat(var(--grid-size), 1fr);


        border: 1px solid #d4d4d4;
        width: var(--container-size);  /* Setting the width based on the container size variable */
        height: var(--container-size); /* Ensure it's a square */
    }

    .cell {
        box-sizing: border-box;
        width: var(--cell-size);
        height: var(--cell-size);
        background-color: #e6e6e6; /* Neutral light gray for unselected cells */
        border: 1px solid #d4d4d4; /* Border for cells */
        border-top: none; /* Remove top border for all cells */
        border-left: none; /* Remove left border for all cells */
        transition: background-color 0.2s ease;

    }

    .cell:hover {
        transform: translateY(-2px); /* subtle lift effect on hover */
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .cell.isWall {
        background-color: #2e2e2e; /* Darker gray for walls */
    }

    .cell.isVisited {
        background-color: #87CEFA; /* Light blue for visited cells */
    }

    .cell.isPath {
        background-color: #FFA500; /* Orange for the path */
    }

    .cell.isStart {
        background-color: #4CAF50; /* Green for start */
    }

    .cell.isEnd {
        background-color: #E91E63; /* Red-pinkish for the end */
    }

    .cell.col-0 {
        border-left: 1px solid #d4d4d4; /* Restore left border for the first cell in each row */
    }
    .cell.row-0 {
        border-top: 1px solid #d4d4d4; /* Restore top border for the first row cells */
    }

    button {
        display: block; /* Full-width button */
        margin: 20px auto; /* Centering */
        padding: 10px 20px;
        background-color: #007BFF;
        color: white;
        border: none;
        border-radius: 5px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.2s ease, transform 0.15s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    button:hover {
        background-color: #0056b3;
        transform: translateY(-2px); /* subtle lift effect */
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }

    button:active {
        transform: translateY(1px); /* subtle press effect */
    }
</style>
