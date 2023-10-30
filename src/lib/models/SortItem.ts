export class SortItem {
	value: number;
	isComparing: boolean = false;
	isSwapping: boolean = false;
	isSorted: boolean = false;
	isPivot: boolean = false;
	isCurrent: boolean = false;
	isMin: boolean = false;
	isMerging: boolean = false;
	height: number;

	constructor(value: number) {
		this.value = value;
		this.height = value * 5; // Assuming you're multiplying the value by 5 for visualization purposes.
	}
	clone(): SortItem {
		const clone = new SortItem(this.value);
		clone.isComparing = this.isComparing;
		clone.isSwapping = this.isSwapping;
		clone.isSorted = this.isSorted;
		clone.isPivot = this.isPivot;
		clone.isCurrent = this.isCurrent;
		clone.isMin = this.isMin;
		clone.isMerging = this.isMerging;
		return clone;
	}
}
