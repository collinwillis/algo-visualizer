export class SortElement {
	constructor(
		public value: number,
		public color: string = '#282c34',
		public groupColor: string | null = null
	) {}

	static generateColor(value: number): string {
		const hue = value * 3.6; // Assuming values are between 0 and 100
		return `hsl(${hue}, 100%, 50%)`;
	}
}

export function createSortElementList(count: number): SortElement[] {
	const list = [];
	for (let i = 0; i < count; i++) {
		list.push(new SortElement(getRandomNumber(0, 50), '#282c34'));
	}
	return list;
}
function getRandomNumber(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
