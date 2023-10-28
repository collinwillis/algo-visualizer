import { GridCell } from '$lib/models/GridCell';

type UpdateGridCallback = (grid: GridCell[][]) => void;

const INFINITE_DISTANCE = Infinity;

export function sleep(speed: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, speed));
}

export async function dijkstrasAlgorithm(
	grid: GridCell[][],
	startRow: number,
	startCol: number,
	endRow: number,
	endCol: number,
	speed: number,
	updateCallback: UpdateGridCallback
): Promise<GridCell[]> {
	const visitedInOrder: GridCell[] = [];
	const startNode = grid[startRow][startCol];
	const endNode = grid[endRow][endCol];
	startNode.distance = 0;

	const unvisitedNodes = getAllNodes(grid);

	while (unvisitedNodes.length) {
		sortNodesByDistance(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if (!closestNode || closestNode.isWall) continue;
		if (closestNode.distance === INFINITE_DISTANCE) break;

		markNodeAsVisited(closestNode, visitedInOrder);
		await animateAndUpdate(grid, updateCallback, speed);

		if (closestNode === endNode) {
			return await animateShortestPath(grid, endNode, updateCallback, speed);
		}

		updateUnvisitedNeighbors(closestNode, grid);
	}

	return visitedInOrder;
}

function sortNodesByDistance(unvisitedNodes: GridCell[]) {
	unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

function markNodeAsVisited(node: GridCell, visitedList: GridCell[]) {
	node.isVisited = true;
	visitedList.push(node);
}

async function animateAndUpdate(grid: GridCell[][], callback: UpdateGridCallback, speed: number) {
	callback(cloneGrid(grid));
	await sleep(speed);
}

async function animateShortestPath(
	grid: GridCell[][], // Add grid as an argument
	endNode: GridCell,
	callback: UpdateGridCallback,
	speed: number
): Promise<GridCell[]> {
	const path = getShortestPath(endNode);
	for (const node of path) {
		node.isPath = true;
		callback(cloneGrid(grid));
		await sleep(speed);
	}
	return path;
}

function updateUnvisitedNeighbors(node: GridCell, grid: GridCell[][]) {
	const neighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of neighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.previous = node;
	}
}

function getUnvisitedNeighbors(node: GridCell, grid: GridCell[][]): GridCell[] {
	const { row, col } = node;
	const neighbors: GridCell[] = [];

	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

	return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid: GridCell[][]): GridCell[] {
	return grid.flat();
}

function getShortestPath(endNode: GridCell): GridCell[] {
	const path: GridCell[] = [];
	let currentNode: GridCell | null = endNode; // <- Allow currentNode to be null
	while (currentNode) {
		path.unshift(currentNode);
		currentNode = currentNode.previous;
	}
	return path;
}

function cloneGrid(grid: GridCell[][]): GridCell[][] {
	return grid.map((row) =>
		row.map((cell) => Object.assign(new GridCell(cell.row, cell.col), cell))
	);
}
