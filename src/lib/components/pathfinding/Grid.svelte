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

    const START_PROPORTION = 0.25; // 25%
    const END_PROPORTION = 0.75;  // 75%

    let draggingStart = false;
    let draggingFinish = false;

    // Responsive Grid
    let gridWidth;
    let gridHeight;


    function updateGridSize() {
        console.log("HELLO");
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Adjust these values based on your layout
        gridWidth = Math.floor(width / 25); // 30 is the approx width of a cell in pixels
        gridHeight = Math.floor(height / 25); // 30 is the approx height of a cell in pixels

        document.documentElement.style.setProperty('--num-cols', gridWidth);

        // Recompute the start and end node positions
        START_NODE_ROW = Math.floor(gridHeight * START_PROPORTION);
        START_NODE_COL = Math.floor(gridWidth * START_PROPORTION);
        FINISH_NODE_ROW = Math.floor(gridHeight * END_PROPORTION);
        FINISH_NODE_COL = Math.floor(gridWidth * END_PROPORTION);

        // Clear and update the grid
        grid = [...getInitialGrid()];
    }


    onMount(() => {
        document.body.style.cursor = 'pointer';
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

    function handleMouseDown(row: number, col: number, event): void {
        event.preventDefault();
        document.body.style.userSelect = "none";
        if (row === START_NODE_ROW && col === START_NODE_COL) {
            draggingStart = true;
            document.body.style.cursor = 'grabbing';
        } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
            draggingFinish = true;
            document.body.style.cursor = 'grabbing';
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
        document.body.style.cursor = 'pointer';
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
                if(node.isStart || node.isEnd) return;
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
        START_NODE_ROW = Math.floor(gridHeight * START_PROPORTION);
        START_NODE_COL = Math.floor(gridWidth * START_PROPORTION);
        FINISH_NODE_ROW = Math.floor(gridHeight * END_PROPORTION);
        FINISH_NODE_COL = Math.floor(gridWidth * END_PROPORTION);

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

    function generateMaze() {
        // Initialize all cells as walls
        for (let row of grid) {
            for (let cell of row) {
                cell.isWall = true;
            }
        }

        // Recursive function to carve the maze
        function carve(x, y) {
            const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];

            // Randomize directions
            directions.sort(() => Math.random() - 0.5);

            for (let [dx, dy] of directions) {
                const nx = x + dx*2, ny = y + dy*2;
                // Adjust the valid carving bounds to be 1 cell away from the edges
                if (nx > 0 && nx < gridWidth - 1 && ny > 0 && ny < gridHeight - 1 && grid[ny][nx].isWall) {
                    grid[y + dy][x + dx].isWall = false;
                    grid[ny][nx].isWall = false;
                    carve(nx, ny);
                }
            }
        }

        const startX = START_NODE_COL % 2 === 0 ? START_NODE_COL + 1 : START_NODE_COL;
        const startY = START_NODE_ROW % 2 === 0 ? START_NODE_ROW + 1 : START_NODE_ROW;

        grid[startY][startX].isWall = false;
        carve(startX, startY);

        // Ensure the start and end nodes are paths
        grid[START_NODE_ROW][START_NODE_COL].isWall = false;
        grid[FINISH_NODE_ROW][FINISH_NODE_COL].isWall = false;

        // Set start and end markers
        grid[START_NODE_ROW][START_NODE_COL].isStart = true;
        grid[FINISH_NODE_ROW][FINISH_NODE_COL].isEnd = true;
        grid = [...grid];
    }





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
        flex-basis: calc(100% / var(--num-cols));
        box-sizing: border-box;
        display: flex;   /* Added this line */
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
<button on:click={generateMaze}>
    Generate Maze
</button>
<div class="grid">
    {#each grid as row, rowIndex}
        <div>
            {#each row as cell, colIndex}
                <Cell
                        isEnd={cell.isEnd}
                        isStart={cell.isStart}
                        isWall={cell.isWall}
                        col={cell.col}
                        row={cell.row}
                        isFirstRow={rowIndex === 0}
                        isFirstCol={colIndex === 0}
                        isLastRow={rowIndex === grid.length - 1}
                        isLastCol={colIndex === row.length - 1}
                        onMouseDown={handleMouseDown}
                        onMouseEnter={handleMouseEnter}
                        onMouseUp={handleMouseUp}
                />
            {/each}
        </div>
    {/each}

</div>
