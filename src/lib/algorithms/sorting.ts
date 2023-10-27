import type { SortElement } from '$lib/models/SortElement';

export type SortingAlgorithm = (
	arr: SortElement[],
	speed: number,
	callback: (arr: SortElement[], a: number, b: number, c?: number, d?: boolean) => void
) => Promise<SortElement[]>;
function swap(arr: SortElement[], i: number, j: number) {
	[arr[i].value, arr[j].value] = [arr[j].value, arr[i].value];
}

export const bubbleSort: SortingAlgorithm = async (arr, speed, callback) => {
	const len = arr.length;
	for (let i = 0; i < len; i++) {
		for (let j = 0; j < len - i - 1; j++) {
			callback(arr, j, j + 1);
			await sleep(speed);
			if (arr[j].value > arr[j + 1].value) {
				swap(arr, j, j + 1);
				callback(arr, j, j + 1);
				await sleep(speed);
			}
		}
	}
	return arr;
};

export const selectionSort: SortingAlgorithm = async (arr, speed, callback) => {
	const len = arr.length;
	for (let i = 0; i < len - 1; i++) {
		let minIndex = i;
		callback(arr, minIndex, minIndex);
		await sleep(speed);
		for (let j = i + 1; j < len; j++) {
			if (arr[j].value < arr[minIndex].value) {
				minIndex = j;
				callback(arr, minIndex, i);
				await sleep(speed);
			}
		}
		if (minIndex !== i) {
			swap(arr, i, minIndex);
			callback(arr, i, minIndex);
			await sleep(speed);
		}
	}
	return arr;
};

export const quickSort: SortingAlgorithm = async (arr, speed, callback) => {
	const len = arr.length;
	if (len <= 1) return arr;

	const partition = async (low: number, high: number): Promise<number> => {
		const pivot = arr[high].value;
		let i = low - 1;
		for (let j = low; j < high; j++) {
			callback(arr, i, j, high);
			await sleep(speed);
			if (arr[j].value < pivot) {
				i++;
				swap(arr, i, j);
				callback(arr, i, j, high);
				await sleep(speed);
			}
		}
		swap(arr, i + 1, high);
		callback(arr, i + 1, high);
		await sleep(speed);
		return i + 1;
	};

	const recursiveQuickSort = async (low: number, high: number): Promise<void> => {
		if (low < high) {
			const pi = await partition(low, high);
			await recursiveQuickSort(low, pi - 1);
			await recursiveQuickSort(pi + 1, high);
		}
	};

	await recursiveQuickSort(0, len - 1);
	return arr;
};

export const insertionSort: SortingAlgorithm = async (arr, speed, callback) => {
	const len = arr.length;
	for (let i = 1; i < len; i++) {
		const key = arr[i].value;
		let j = i - 1;
		while (j >= 0 && arr[j].value > key) {
			arr[j + 1].value = arr[j].value;
			callback(arr, i, j); // Moved callback here to reflect the state after update
			await sleep(speed);
			j--;
		}
		arr[j + 1].value = key;
		callback(arr, i, j + 1); // Added callback here to reflect the final state of the current iteration
		await sleep(speed);
	}
	return arr;
};

export const mergeSort: SortingAlgorithm = async (arr, speed, callback) => {
	const mergeSortRecursive = async (
		arr: SortElement[],
		left: number,
		right: number
	): Promise<void> => {
		if (left >= right) return; // Base case: array of length 1 is already sorted

		const mid = Math.floor((left + right) / 2);
		await mergeSortRecursive(arr, left, mid); // Sort left half
		await mergeSortRecursive(arr, mid + 1, right); // Sort right half
		await merge(arr, speed, left, mid, right, callback); // Merge two sorted halves
	};

	await mergeSortRecursive(arr, 0, arr.length - 1);
	return arr;
};

const merge = async (
	arr: SortElement[],
	speed: number,
	left: number,
	mid: number,
	right: number,
	callback: (
		arr: SortElement[],
		leftIndex: number,
		midIndex: number, // Adjusted the argument name to midIndex for clarity
		mergedIndex: number,
		isComparison: boolean
	) => void // Adjusted callback signature
): Promise<void> => {
	const leftArr = arr.slice(left, mid + 1);
	const rightArr = arr.slice(mid + 1, right + 1);

	let i = 0;
	let j = 0;
	let k = left;

	while (i < leftArr.length && j < rightArr.length) {
		callback(arr, left + i, mid, k, true); // Comparison
		await sleep(speed);
		if (leftArr[i].value <= rightArr[j].value) {
			arr[k] = leftArr[i];
			i++;
		} else {
			arr[k] = rightArr[j];
			j++;
		}
		console.log(`left + i: ${left + i}, mid + 1 + j: ${mid + 1 + j}, k: ${k}`);
		callback(arr, left + i, mid, k, false); // Merge
		await sleep(speed);
		k++;
	}

	while (i < leftArr.length) {
		arr[k] = leftArr[i];
		callback(arr, left + i, mid, k, false); // Merge
		await sleep(speed);
		i++;
		k++;
	}

	while (j < rightArr.length) {
		arr[k] = rightArr[j];
		callback(arr, left + i, mid, k, false); // Merge
		await sleep(speed);
		j++;
		k++;
	}
};

export const heapSort: SortingAlgorithm = async (arr, speed, callback) => {
	const n = arr.length;

	const heapify = async (arr: SortElement[], n: number, i: number) => {
		let largest = i;
		const l = 2 * i + 1;
		const r = 2 * i + 2;

		if (l < n && arr[l].value > arr[largest].value) {
			largest = l;
		}
		if (r < n && arr[r].value > arr[largest].value) {
			largest = r;
		}

		if (largest !== i) {
			swap(arr, i, largest);
			callback(arr, i, largest, undefined, true); // isHeapifying is true
			await sleep(speed);
			await heapify(arr, n, largest);
		}
	};

	for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
		await heapify(arr, n, i);
	}
	for (let i = n - 1; i > 0; i--) {
		swap(arr, 0, i);
		callback(arr, 0, i, undefined, false);
		await sleep(speed);
		await heapify(arr, i, 0);
	}

	return arr;
};

export function sleep(speed: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, speed));
}

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
		default:
			return insertionSort;
	}
};
