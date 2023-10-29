export class GridCell {
	row: number;
	col: number;
	isWall: boolean = false;
	isStart: boolean = false;
	isEnd: boolean = false;
	isVisited: boolean = false;
	isPath: boolean = false;
	distance: number = Infinity; // Represents g(n) in A* (cost from start to this node)
	h: number = Infinity; // Heuristic value, represents h(n) in A* (estimated cost from this node to finish)
	f: number = Infinity; // Total estimated cost, represents f(n) = g(n) + h(n) in A*
	previous: GridCell | null = null;

	constructor(row: number, col: number) {
		this.row = row;
		this.col = col;
	}

	// If needed, we can add a method to compute or update h and f based on a target node.
	computeHeuristic(target: GridCell) {
		this.h = Math.abs(this.row - target.row) + Math.abs(this.col - target.col);
		this.f = this.distance + this.h;
	}
}
