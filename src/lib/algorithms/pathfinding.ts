// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
import type { GridCell } from '$lib/models/GridCell';

export function dijkstra(
	grid: GridCell[][],
	startNode: GridCell,
	finishNode: GridCell
): GridCell[] {
	const visitedNodesInOrder: GridCell[] = [];
	startNode.distance = 0;
	const unvisitedNodes = getAllNodes(grid);
	while (unvisitedNodes.length) {
		sortNodesByDistance(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if (!closestNode) continue; // Continue if closestNode is undefined
		// If we encounter a wall, we skip it.
		if (closestNode.isWall) continue;
		// If the closest node is at a distance of infinity,
		// we must be trapped and should therefore stop.
		if (closestNode.distance === Infinity) return visitedNodesInOrder;
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);
		if (closestNode === finishNode) return visitedNodesInOrder;
		updateUnvisitedNeighbors(closestNode, grid);
	}
	return visitedNodesInOrder; // It's good to have a fallback return at the end
}

// Perform A* algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, allowing computation of the shortest path
// by backtracking from the finish node.
export function aStar(grid: GridCell[][], startNode: GridCell, finishNode: GridCell): GridCell[] {
	const visitedNodesInOrder: GridCell[] = [];
	startNode.distance = 0;
	startNode.h = heuristic(startNode, finishNode);
	startNode.f = startNode.distance + startNode.h;
	const unvisitedNodes = getAllNodes(grid);
	while (unvisitedNodes.length) {
		sortNodesByF(unvisitedNodes);
		const closestNode = unvisitedNodes.shift();
		if (!closestNode) continue; // Continue if closestNode is undefined
		if (closestNode.isWall) continue; // If we encounter a wall, we skip it.
		if (closestNode.distance === Infinity) return visitedNodesInOrder; // If closest node is at a distance of infinity, we're trapped.
		closestNode.isVisited = true;
		visitedNodesInOrder.push(closestNode);
		if (closestNode === finishNode) return visitedNodesInOrder;
		updateUnvisitedNeighborsForAStar(closestNode, grid, finishNode);
	}
	return visitedNodesInOrder;
}

export function breadthFirstSearch(
	grid: GridCell[][],
	startNode: GridCell,
	finishNode: GridCell
): GridCell[] {
	const visitedNodesInOrder: GridCell[] = [];
	const queue: GridCell[] = [];

	// Mark the start node as visited and enqueue it
	startNode.isVisited = true;
	queue.push(startNode);

	while (queue.length !== 0) {
		const currentNode = queue.shift();
		if (!currentNode) continue; // Continue if currentNode is undefined

		// If we encounter a wall, we skip it.
		if (currentNode.isWall) continue;

		visitedNodesInOrder.push(currentNode);

		if (currentNode === finishNode) return visitedNodesInOrder;

		// Enqueue unvisited neighbors
		const unvisitedNeighbors = getUnvisitedNeighbors(currentNode, grid);
		for (const neighbor of unvisitedNeighbors) {
			if (!neighbor.isVisited) {
				neighbor.isVisited = true;
				neighbor.previous = currentNode;
				queue.push(neighbor);
			}
		}
	}
	return visitedNodesInOrder; // Fallback return at the end
}

function sortNodesByDistance(unvisitedNodes: GridCell[]) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function sortNodesByF(unvisitedNodes: GridCell[]) {
	unvisitedNodes.sort((nodeA, nodeB) => nodeA.f - nodeB.f);
}

function heuristic(node: GridCell, finishNode: GridCell): number {
	// Manhattan distance
	return Math.abs(node.row - finishNode.row) + Math.abs(node.col - finishNode.col);
}
function updateUnvisitedNeighborsForAStar(
	node: GridCell,
	grid: GridCell[][],
	finishNode: GridCell
) {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of unvisitedNeighbors) {
		const tentative_distance = node.distance + 1;
		if (tentative_distance < neighbor.distance) {
			neighbor.distance = tentative_distance;
			neighbor.h = heuristic(neighbor, finishNode);
			neighbor.f = neighbor.distance + neighbor.h;
			neighbor.previous = node;
		}
	}
}

function updateUnvisitedNeighbors(node: GridCell, grid: GridCell[][]) {
	const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
	for (const neighbor of unvisitedNeighbors) {
		neighbor.distance = node.distance + 1;
		neighbor.previous = node;
	}
}

function getUnvisitedNeighbors(node: GridCell, grid: GridCell[][]) {
	const neighbors = [];
	const { col, row } = node;
	if (row > 0) neighbors.push(grid[row - 1][col]);
	if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
	if (col > 0) neighbors.push(grid[row][col - 1]);
	if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
	return neighbors.filter((neighbor) => !neighbor.isVisited);
}

function getAllNodes(grid: GridCell[][]) {
	const nodes: GridCell[] = [];
	for (const row of grid) {
		for (const node of row) {
			nodes.push(node);
		}
	}
	return nodes;
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dijkstra method above.
export function getNodesInShortestPathOrder(finishNode: GridCell): GridCell[] {
	const nodesInShortestPathOrder: GridCell[] = [];
	let currentNode: GridCell | null = finishNode;
	while (currentNode !== null) {
		nodesInShortestPathOrder.unshift(currentNode);
		currentNode = currentNode.previous;
	}
	return nodesInShortestPathOrder;
}
