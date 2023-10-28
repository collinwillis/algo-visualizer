export class GridCell {
	row: number;
	col: number;
	isWall: boolean = false;
	isStart: boolean = false;
	isEnd: boolean = false;
	isVisited: boolean = false;
	isPath: boolean = false;
	distance: number = Infinity;
	previous: GridCell | null = null;

	constructor(row: number, col: number) {
		this.row = row;
		this.col = col;
	}
}
