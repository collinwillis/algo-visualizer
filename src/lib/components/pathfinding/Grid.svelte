<script lang="ts">
    import Cell from './Cell.svelte';
    import {aStar, breadthFirstSearch, dijkstra, getNodesInShortestPathOrder} from '$lib/algorithms/pathfinding.ts';
    // Equivalent to componentDidMount
    import {onDestroy, onMount} from 'svelte';
    import {GridCell} from "$lib/models/GridCell.js";


    let grid: GridCell[][] = [];

    let mouseIsPressed: boolean = false;

    let START_NODE_ROW: number = 10;
    let START_NODE_COL: number = 15;
    let FINISH_NODE_ROW: number = 10;
    let FINISH_NODE_COL: number = 35;

    let draggingStart = false;
    let draggingFinish = false;

    // Responsive Grid
    let gridWidth;
    let gridHeight;


    function updateGridSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        document.documentElement.style.setProperty('--num-cols', gridWidth);

        // Adjust these values based on your layout
        gridWidth = Math.floor(width / 35); // 30 is the approx width of a cell in pixels
        gridHeight = Math.floor(height / 35); // 30 is the approx height of a cell in pixels

        // Clear and update the grid
        grid = getInitialGrid();
    }

    onMount(() => {
        // Set initial grid size and establish the grid
        updateGridSize();

        // Add the resize event listener
        window.addEventListener('resize', updateGridSize);

        // Add the mouse event listeners
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mousemove', handleMouseMove);

        // Cleanup on component destruction
        onDestroy(() => {
            window.removeEventListener('resize', updateGridSize);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMove);
        });
    });

    function handleMouseDown(row: number, col: number): void {
        document.body.style.userSelect = "none";

        if (row === START_NODE_ROW && col === START_NODE_COL) {
            draggingStart = true;
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            draggingFinish = true;
        } else {
            grid = getNewGridWithWallToggled(grid, row, col);
            mouseIsPressed = true;
        }
    }


    function handleMouseEnter(row: number, col: number): void {
        if (draggingStart) {
            grid[START_NODE_ROW][START_NODE_COL].isStart = false; // Reset previous start node
            START_NODE_ROW = row;
            START_NODE_COL = col;
            grid[row][col].isStart = true;
        } else if (draggingFinish) {
            grid[FINISH_NODE_ROW][FINISH_NODE_COL].isEnd = false; // Reset previous finish node
            FINISH_NODE_ROW = row;
            FINISH_NODE_COL = col;
            grid[row][col].isEnd = true;
        } else if (mouseIsPressed) {
            grid = getNewGridWithWallToggled(grid, row, col);
        }
    }


    function handleMouseUp(): void {
        document.body.style.userSelect = "";
        mouseIsPressed = false;
        draggingStart = false;
        draggingFinish = false;
    }

    function handleMouseMove(e) {
        if (draggingStart || draggingFinish) {
            let cellElement = e.target as HTMLElement;
            if (cellElement && cellElement.id && cellElement.id.startsWith('node-')) {
                let coords = cellElement.id.split('-').slice(1).map(Number);
                if (coords.length === 2) {
                    let [row, col] = coords;
                    handleMouseEnter(row, col);
                }
            }
        }
    }


    function visualizeDijkstra(): void {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder);
    }

    function visualizeAStar(): void {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = aStar(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder); // Reuse the same animation function
    }

    function visualizeBSF(): void {
        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        const visitedNodesInOrder = breadthFirstSearch(grid, startNode, finishNode);
        const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder); // Reuse the same animation function
    }


    function animateAlgorithm(visitedNodesInOrder, nodesInShortestPathOrder) {
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            if (i === visitedNodesInOrder.length) {
                setTimeout(() => {
                    animateShortestPath(nodesInShortestPathOrder);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                const node = visitedNodesInOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-visited';
            }, 10 * i);
        }
    }

    function animateShortestPath(nodesInShortestPathOrder) {
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            setTimeout(() => {
                const node = nodesInShortestPathOrder[i];
                document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
            }, 50 * i);
        }
    }

    const getInitialGrid = (): GridCell[][] => {
        const grid: GridCell[][] = [];
        for (let row = 0; row < gridHeight; row++) {
            const currentRow: GridCell[] = [];
            for (let col = 0; col < gridWidth; col++) {
                currentRow.push(new GridCell(row, col));
            }
            grid.push(currentRow);
        }

        // Set start and end nodes, with bounds checking
        START_NODE_ROW = Math.min(START_NODE_ROW, gridHeight - 1);
        START_NODE_COL = Math.min(START_NODE_COL, gridWidth - 1);
        FINISH_NODE_ROW = Math.min(FINISH_NODE_ROW, gridHeight - 1);
        FINISH_NODE_COL = Math.min(FINISH_NODE_COL, gridWidth - 1);

        grid[START_NODE_ROW][START_NODE_COL].isStart = true;
        grid[FINISH_NODE_ROW][FINISH_NODE_COL].isEnd = true;

        return grid;
    };

    const getNewGridWithWallToggled = (grid: GridCell[][], row: number, col: number): GridCell[][] => {
        // Check if the clicked node is the start or end node
        if ((row === START_NODE_ROW && col === START_NODE_COL) || (row === FINISH_NODE_ROW && col === FINISH_NODE_COL)) {
            return grid; // If so, return the original grid without toggling
        }
        const newGrid: GridCell[][] = grid.map(row => row.slice());
        const node = newGrid[row][col];
        node.isWall = !node.isWall;
        return newGrid;
    };

</script>

<style>
    .grid {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        max-width: 100%;
        height: auto;
    }


    .grid > div {
        flex-basis: calc(100% / var(--num-cols)); /* where --num-cols is your number of columns */
        box-sizing: border-box; /* optional, for spacing/padding */
    }
</style>

<button on:click={visualizeDijkstra}>
    Visualize Dijkstra's Algorithm
</button>
<button on:click={visualizeAStar}>
    Visualize A* Search Algorithm
</button>
<button on:click={visualizeBSF}>
    Visualize BSF Algorithm
</button>
<div class="grid">
    {#each grid as row, rowIndex}
        <div class="{rowIndex === grid.length - 1 ? 'last-row' : ''}">
            {#each row as cell}
                <Cell isEnd={cell.isEnd} isStart={cell.isStart} isWall={cell.isWall} col={cell.col} row={cell.row} onMouseDown={handleMouseDown} onMouseEnter={handleMouseEnter} onMouseUp={handleMouseUp} />
            {/each}
        </div>
    {/each}
</div>
