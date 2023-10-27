import { SortElement } from '$lib/models/SortElement';
import type { UpdateCallback } from '$lib/utilities/types';

const SWAP_COLOR = '#e63946';
const COMPARE_COLOR = '#0077b6';
const SORTED_COLOR = '#50c878';
const POTENTIAL_SWAP_COLOR = '#ffb703';
const PIVOT_COLOR = '#ff5733';
const UPCOMING_COMPARE_COLOR = '#9ed8eb';

function swap(arr: SortElement[], i: number, j: number) {
	[arr[i].value, arr[j].value] = [arr[j].value, arr[i].value];
}

function visualizeUpdate(
	arr: SortElement[],
	updates: { index: number; color: string }[],
	updateCallback: UpdateCallback
) {
	const updatedArray = arr.map((item, index) => {
		const update = updates.find((u) => u.index === index);
		return update ? new SortElement(item.value, update.color, item.groupColor) : item;
	});
	updateCallback(updatedArray);
}

export function sleep(speed: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, speed));
}

export const bubbleSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const len = arr.length;
	for (let i = 0; i < len; i++) {
		for (let j = 0; j < len - i - 1; j++) {
			visualizeUpdate(
				arr,
				[
					{ index: j, color: COMPARE_COLOR },
					{ index: j + 1, color: COMPARE_COLOR }
				],
				updateCallback
			);
			await sleep(speed);
			if (arr[j].value > arr[j + 1].value) {
				swap(arr, j, j + 1);
				visualizeUpdate(
					arr,
					[
						{ index: j, color: SWAP_COLOR },
						{ index: j + 1, color: SWAP_COLOR }
					],
					updateCallback
				);
				await sleep(speed);
			}
		}
		visualizeUpdate(arr, [{ index: len - i - 1, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	for (let i = 0; i < arr.length; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

export const selectionSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const len = arr.length;
	for (let i = 0; i < len - 1; i++) {
		let minIndex = i;
		for (let j = i + 1; j < len; j++) {
			visualizeUpdate(
				arr,
				[
					{ index: minIndex, color: POTENTIAL_SWAP_COLOR },
					{ index: j, color: COMPARE_COLOR }
				],
				updateCallback
			);
			await sleep(speed);
			if (arr[j].value < arr[minIndex].value) {
				minIndex = j;
			}
		}
		if (minIndex !== i) {
			swap(arr, i, minIndex);
			visualizeUpdate(
				arr,
				[
					{ index: i, color: SWAP_COLOR },
					{ index: minIndex, color: SWAP_COLOR }
				],
				updateCallback
			);
			await sleep(speed);
		}
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	for (let i = 0; i < arr.length; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

async function partition(
	arr: SortElement[],
	low: number,
	high: number,
	speed: number,
	updateCallback: UpdateCallback
): Promise<number> {
	const pivot = arr[high].value;
	let i = low - 1;
	visualizeUpdate(arr, [{ index: high, color: PIVOT_COLOR }], updateCallback);
	for (let j = low; j <= high - 1; j++) {
		if (j < high - 1) {
			visualizeUpdate(
				arr,
				[
					{ index: j, color: COMPARE_COLOR },
					{ index: j + 1, color: UPCOMING_COMPARE_COLOR }
				],
				updateCallback
			);
		} else {
			visualizeUpdate(arr, [{ index: j, color: COMPARE_COLOR }], updateCallback);
		}
		await sleep(speed);
		if (arr[j].value < pivot) {
			i++;
			swap(arr, i, j);
			visualizeUpdate(
				arr,
				[
					{ index: i, color: SWAP_COLOR },
					{ index: j, color: SWAP_COLOR }
				],
				updateCallback
			);
			await sleep(speed);
		}
	}
	swap(arr, i + 1, high);
	await sleep(speed);
	return i + 1;
}

export const quickSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback,
	low?: number,
	high?: number
): Promise<SortElement[]> => {
	if (typeof low !== 'number') low = 0;
	if (typeof high !== 'number') high = arr.length - 1;
	if (low < high) {
		const pi = await partition(arr, low, high, speed, updateCallback);

		// Mark the pivot as sorted
		visualizeUpdate(arr, [{ index: pi, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);

		await quickSort(arr, speed, updateCallback, low, pi - 1);
		await quickSort(arr, speed, updateCallback, pi + 1, high);
	}
	return arr;
};

export const insertionSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	for (let i = 1; i < arr.length; i++) {
		const key = arr[i].value;
		let j = i - 1;
		visualizeUpdate(
			arr,
			[
				{ index: i, color: COMPARE_COLOR },
				{ index: j, color: UPCOMING_COMPARE_COLOR }
			],
			updateCallback
		);
		await sleep(speed);
		while (j >= 0 && arr[j].value > key) {
			arr[j + 1].value = arr[j].value;
			visualizeUpdate(
				arr,
				[
					{ index: j, color: SWAP_COLOR },
					{ index: j + 1, color: SWAP_COLOR }
				],
				updateCallback
			);
			await sleep(speed);
			j = j - 1;
		}
		arr[j + 1].value = key;
		for (let k = 0; k <= i; k++) {
			visualizeUpdate(arr, [{ index: k, color: SORTED_COLOR }], updateCallback);
		}
		await sleep(speed);
	}
	for (let i = 0; i < arr.length; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

async function merge(
	arr: SortElement[],
	left: number,
	middle: number,
	right: number,
	speed: number,
	updateCallback: UpdateCallback
) {
	const n1 = middle - left + 1;
	const n2 = right - middle;

	const L: SortElement[] = [];
	const R: SortElement[] = [];

	for (let i = 0; i < n1; i++) L.push({ ...arr[left + i] });
	for (let j = 0; j < n2; j++) R.push({ ...arr[middle + 1 + j] });

	let i = 0,
		j = 0,
		k = left;
	while (i < n1 && j < n2) {
		visualizeUpdate(
			arr,
			[
				{ index: left + i, color: COMPARE_COLOR },
				{ index: middle + 1 + j, color: COMPARE_COLOR }
			],
			updateCallback
		);
		await sleep(speed);
		if (L[i].value <= R[j].value) {
			arr[k].value = L[i].value;
			i++;
		} else {
			arr[k].value = R[j].value;
			j++;
		}
		k++;
	}

	while (i < n1) {
		arr[k].value = L[i].value;
		i++;
		k++;
	}

	while (j < n2) {
		arr[k].value = R[j].value;
		j++;
		k++;
	}
	// Mark the merged portion as sorted
	for (let m = left; m <= right; m++) {
		visualizeUpdate(arr, [{ index: m, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
}

export const mergeSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback,
	left?: number,
	right?: number
): Promise<SortElement[]> => {
	if (typeof left !== 'number') left = 0;
	if (typeof right !== 'number') right = arr.length - 1;
	if (left < right) {
		const middle = Math.floor((left + right) / 2);
		await mergeSort(arr, speed, updateCallback, left, middle);
		await mergeSort(arr, speed, updateCallback, middle + 1, right);
		await merge(arr, left, middle, right, speed, updateCallback);
	}
	return arr;
};

async function heapify(
	arr: SortElement[],
	n: number,
	i: number,
	speed: number,
	updateCallback: UpdateCallback
) {
	let largest = i;
	const left = 2 * i + 1;
	const right = 2 * i + 2;

	if (left < n && arr[left].value > arr[largest].value) largest = left;

	if (right < n && arr[right].value > arr[largest].value) largest = right;

	if (largest !== i) {
		swap(arr, i, largest);
		visualizeUpdate(
			arr,
			[
				{ index: i, color: SWAP_COLOR },
				{ index: largest, color: SWAP_COLOR }
			],
			updateCallback
		);
		await sleep(speed);
		await heapify(arr, n, largest, speed, updateCallback);
	}
}

export const heapSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const n = arr.length;
	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(arr, n, i, speed, updateCallback);
	for (let i = n - 1; i > 0; i--) {
		swap(arr, 0, i);
		visualizeUpdate(
			arr,
			[
				{ index: 0, color: SWAP_COLOR },
				{ index: i, color: SORTED_COLOR }
			],
			updateCallback
		);
		await sleep(speed);
		await heapify(arr, i, 0, speed, updateCallback);
	}
	for (let i = 0; i < n; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

export const shellSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const n = arr.length;
	for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
		for (let i = gap; i < n; i += 1) {
			const temp = arr[i].value;
			let j;
			for (j = i; j >= gap && arr[j - gap].value > temp; j -= gap) {
				visualizeUpdate(arr, [{ index: j, color: SWAP_COLOR }], updateCallback);
				await sleep(speed);
				arr[j].value = arr[j - gap].value;
			}
			arr[j].value = temp;
			visualizeUpdate(arr, [{ index: j, color: COMPARE_COLOR }], updateCallback);
			await sleep(speed);
		}
	}
	for (let i = 0; i < n; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

export const countingSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const maxVal = Math.max(...arr.map((item) => item.value));
	const minVal = Math.min(...arr.map((item) => item.value));
	const range = maxVal - minVal + 1;
	const count: number[] = Array(range).fill(0);
	const output: SortElement[] = Array(arr.length).fill(new SortElement(0));

	// Count occurrences
	for (let i = 0; i < arr.length; i++) {
		count[arr[i].value - minVal]++;
	}

	// Update count[i] to store its position
	for (let i = 1; i < count.length; i++) {
		count[i] += count[i - 1];
	}

	// Build output array and visualize
	for (let i = arr.length - 1; i >= 0; i--) {
		output[count[arr[i].value - minVal] - 1] = arr[i];
		count[arr[i].value - minVal]--;
		visualizeUpdate(arr, [{ index: i, color: SWAP_COLOR }], updateCallback);
		await sleep(speed);
	}

	// Copy output array to arr[] so that arr[] contains sorted characters
	for (let i = 0; i < arr.length; i++) {
		arr[i] = output[i];
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}

	return arr;
};

// Helper function to get the maximum value in arr[]
function getMax(arr: SortElement[]): number {
	let max = arr[0].value;
	for (let i = 1; i < arr.length; i++) if (arr[i].value > max) max = arr[i].value;
	return max;
}

// Counting sort function to sort arr[] based on the digit represented by exp
async function countSortForRadix(
	arr: SortElement[],
	exp: number,
	speed: number,
	updateCallback: UpdateCallback
): Promise<void> {
	const n = arr.length;
	const output: SortElement[] = Array(n).fill(new SortElement(0));
	const count: number[] = Array(10).fill(0);

	// Count occurrences of occurrences in arr[]
	for (let i = 0; i < n; i++) {
		count[Math.floor(arr[i].value / exp) % 10]++;
	}

	// Change count[i] so that count[i] contains actual position of this digit in output[]
	for (let i = 1; i < 10; i++) {
		count[i] += count[i - 1];
	}

	for (let i = n - 1; i >= 0; i--) {
		output[count[Math.floor(arr[i].value / exp) % 10] - 1] = arr[i];
		count[Math.floor(arr[i].value / exp) % 10]--;
	}

	for (let i = 0; i < n; i++) {
		arr[i] = output[i];
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
}

export const radixSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const m = getMax(arr); // Find the maximum number to know the number of digits

	// Do counting sort for every digit based on place value (units, tens, hundreds, etc.)
	for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
		await countSortForRadix(arr, exp, speed, updateCallback);
	}

	for (let i = 0; i < arr.length; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}

	return arr;
};

export const bucketSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const n = arr.length;
	if (n <= 1) return arr;

	const min = Math.min(...arr.map((el) => el.value));
	const max = Math.max(...arr.map((el) => el.value));
	const range = max - min + 1;
	const numBuckets = Math.floor(Math.sqrt(n)); // Using square root of n as the number of buckets
	const bucketSize = Math.ceil(range / numBuckets);

	const buckets: SortElement[][] = Array.from({ length: numBuckets }, () => []);

	// Distribute elements into buckets
	for (let i = 0; i < n; i++) {
		const bucketIndex = Math.floor((arr[i].value - min) / bucketSize);
		visualizeUpdate(arr, [{ index: i, color: COMPARE_COLOR }], updateCallback);
		await sleep(speed);
		buckets[bucketIndex].push(arr[i]);
	}

	let index = 0;
	for (let i = 0; i < numBuckets; i++) {
		// Sort each bucket
		// For simplicity, we can use insertion sort here, or any other sort method
		for (let j = 1; j < buckets[i].length; j++) {
			const key = buckets[i][j].value;
			let k = j - 1;
			while (k >= 0 && buckets[i][k].value > key) {
				buckets[i][k + 1].value = buckets[i][k].value;
				k--;
			}
			buckets[i][k + 1].value = key;
		}

		// Gather elements from buckets and update visualization
		for (let j = 0; j < buckets[i].length; j++) {
			arr[index++] = buckets[i][j];
			visualizeUpdate(arr, [{ index: index - 1, color: SORTED_COLOR }], updateCallback);
			await sleep(speed);
		}
	}

	return arr;
};

export const combSort = async (
	arr: SortElement[],
	speed: number,
	updateCallback: UpdateCallback
): Promise<SortElement[]> => {
	const len = arr.length;
	let gap = len;
	let swapped = true;

	const shrink = 1.3; // Shrinking factor

	while (gap > 1 || swapped) {
		gap = Math.floor(gap / shrink);
		if (gap < 1) {
			// Minimum gap is 1
			gap = 1;
		}
		swapped = false;
		for (let i = 0; i + gap < len; i++) {
			visualizeUpdate(
				arr,
				[
					{ index: i, color: COMPARE_COLOR },
					{ index: i + gap, color: COMPARE_COLOR }
				],
				updateCallback
			);
			await sleep(speed);

			if (arr[i].value > arr[i + gap].value) {
				swap(arr, i, i + gap);
				visualizeUpdate(
					arr,
					[
						{ index: i, color: SWAP_COLOR },
						{ index: i + gap, color: SWAP_COLOR }
					],
					updateCallback
				);
				await sleep(speed);
				swapped = true;
			}
		}
	}
	for (let i = 0; i < arr.length; i++) {
		visualizeUpdate(arr, [{ index: i, color: SORTED_COLOR }], updateCallback);
		await sleep(speed);
	}
	return arr;
};

export const getAlgorithm = (algorithm: string) => {
	switch (algorithm) {
		case 'bubbleSort':
			return bubbleSort;
		case 'selectionSort':
			return selectionSort;
		case 'quickSort':
			return quickSort;
		case 'mergeSort':
			return mergeSort;
		case 'heapSort':
			return heapSort;
		case 'insertionSort':
			return insertionSort;
		case 'shellSort':
			return shellSort;
		case 'countingSort':
			return countingSort;
		case 'radixSort':
			return radixSort;
		case 'bucketSort':
			return bucketSort;
		case 'combSort':
			return combSort;
		default:
			return bubbleSort; // default can be any other sort as well.
	}
};
