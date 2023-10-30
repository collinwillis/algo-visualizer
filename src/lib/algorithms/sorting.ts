import type { SortItem } from '$lib/models/SortItem';

export function bubbleSort(array: SortItem[]): SortItem[][] {
	const steps: SortItem[][] = [];
	const n = array.length;

	for (let i = 0; i < n - 1; i++) {
		for (let j = 0; j < n - i - 1; j++) {
			array[j].isComparing = true;
			array[j + 1].isComparing = true;
			steps.push(array.map((item) => item.clone()));

			if (array[j].value > array[j + 1].value) {
				[array[j].value, array[j + 1].value] = [array[j + 1].value, array[j].value];
				array[j].isSwapping = true;
				array[j + 1].isSwapping = true;
				steps.push(array.map((item) => item.clone()));

				array[j].isSwapping = false;
				array[j + 1].isSwapping = false;
			}

			array[j].isComparing = false;
			array[j + 1].isComparing = false;
		}
		array[n - i - 1].isSorted = true;
		steps.push(array.map((item) => item.clone()));
	}

	array[0].isSorted = true;
	steps.push(array.map((item) => item.clone()));

	return steps;
}

export function selectionSort(array: SortItem[]): SortItem[][] {
	const steps: SortItem[][] = [];
	const n = array.length;

	for (let i = 0; i < n - 1; i++) {
		let minIdx = i;
		array[i].isCurrent = true; // Start with i as current
		steps.push(array.map((item) => item.clone()));

		for (let j = i + 1; j < n; j++) {
			array[j].isComparing = true;
			steps.push(array.map((item) => item.clone()));

			if (array[j].value < array[minIdx].value) {
				if (minIdx !== i) array[minIdx].isMin = false; // Reset the previous min item
				minIdx = j;
				array[minIdx].isMin = true;
				steps.push(array.map((item) => item.clone()));
			}

			array[j].isComparing = false;
		}

		if (minIdx !== i) {
			[array[i].value, array[minIdx].value] = [array[minIdx].value, array[i].value];
			array[i].isSwapping = true;
			array[minIdx].isSwapping = true;
			steps.push(array.map((item) => item.clone()));
			array[i].isSwapping = false;
			array[minIdx].isSwapping = false;
		}

		array[minIdx].isMin = false; // Reset the min item
		array[i].isCurrent = false; // Reset the current item
		array[i].isSorted = true;
		steps.push(array.map((item) => item.clone()));
	}

	return steps;
}

export function insertionSort(array: SortItem[]): SortItem[][] {
	const steps: SortItem[][] = [];
	const n = array.length;

	for (let i = 1; i < n; i++) {
		const key = array[i].value;
		array[i].isCurrent = true;
		steps.push(array.map((item) => item.clone()));

		let j = i - 1;
		while (j >= 0 && array[j].value > key) {
			array[j + 1].isComparing = true;
			array[j].isComparing = true;
			steps.push(array.map((item) => item.clone()));

			array[j + 1].value = array[j].value;
			array[j + 1].isSwapping = true;
			array[j].isSwapping = true;
			steps.push(array.map((item) => item.clone()));
			array[j + 1].isSwapping = false;
			array[j].isSwapping = false;

			array[j + 1].isComparing = false;
			array[j].isComparing = false;
			j--;
		}

		array[i].isCurrent = false;
		array[j + 1].value = key;
		steps.push(array.map((item) => item.clone()));
	}

	for (let i = 0; i < n; i++) {
		array[i].isSorted = true;
		steps.push(array.map((item) => item.clone()));
	}

	return steps;
}

export function quickSort(array: SortItem[]): SortItem[][] {
	const steps: SortItem[][] = [];

	const recursiveQuickSort = (low: number, high: number): void => {
		if (low < high) {
			const pivotIndex = partition(low, high);
			recursiveQuickSort(low, pivotIndex - 1);
			recursiveQuickSort(pivotIndex + 1, high);
		}
	};

	const partition = (low: number, high: number): number => {
		const pivot = array[high].value;
		array[high].isPivot = true;
		steps.push(array.map((item) => item.clone()));

		let i = low - 1;

		for (let j = low; j < high; j++) {
			array[j].isComparing = true;
			steps.push(array.map((item) => item.clone()));

			if (array[j].value < pivot) {
				i++;
				[array[i].value, array[j].value] = [array[j].value, array[i].value];
				array[i].isSwapping = true;
				array[j].isSwapping = true;
				steps.push(array.map((item) => item.clone()));
				array[i].isSwapping = false;
				array[j].isSwapping = false;
			}

			array[j].isComparing = false;
		}
		[array[i + 1].value, array[high].value] = [array[high].value, array[i + 1].value];
		array[i + 1].isSwapping = true;
		array[high].isSwapping = true;
		steps.push(array.map((item) => item.clone()));
		array[i + 1].isSwapping = false;
		array[high].isSwapping = false;

		array[high].isPivot = false;
		return i + 1;
	};

	recursiveQuickSort(0, array.length - 1);

	for (let i = 0; i < array.length; i++) {
		array[i].isSorted = true;
		steps.push(array.map((item) => item.clone()));
	}

	return steps;
}

export function mergeSort(array: SortItem[]): SortItem[][] {
	const steps: SortItem[][] = [];
	const auxiliary: SortItem[] = Array.from({ length: array.length }, (_, i) => array[i].clone());

	const merge = (left: number, mid: number, right: number) => {
		// Indicate merging is starting
		for (let m = left; m <= right; m++) {
			array[m].isMerging = true;
		}
		steps.push(array.map((item) => item.clone()));

		let i = left;
		let j = mid + 1;
		let k = left;

		while (i <= mid && j <= right) {
			array[i].isComparing = true;
			array[j].isComparing = true;
			steps.push(array.map((item) => item.clone()));

			if (auxiliary[i].value <= auxiliary[j].value) {
				array[k].value = auxiliary[i].value;
				array[k].isSwapping = true;
				steps.push(array.map((item) => item.clone()));
				array[k].isSwapping = false;
				i++;
			} else {
				array[k].value = auxiliary[j].value;
				array[k].isSwapping = true;
				steps.push(array.map((item) => item.clone()));
				array[k].isSwapping = false;
				j++;
			}
			k++;
		}

		while (i <= mid) {
			array[k].value = auxiliary[i].value;
			array[k].isSwapping = true;
			steps.push(array.map((item) => item.clone()));
			array[k].isSwapping = false;
			i++;
			k++;
		}

		while (j <= right) {
			array[k].value = auxiliary[j].value;
			array[k].isSwapping = true;
			steps.push(array.map((item) => item.clone()));
			array[k].isSwapping = false;
			j++;
			k++;
		}

		for (let i = left; i <= right; i++) {
			auxiliary[i] = array[i].clone();
			array[i].isMerging = false; // Indicate merging is done for this part
		}
		steps.push(array.map((item) => item.clone()));
	};

	const recursiveMergeSort = (left: number, right: number) => {
		if (left < right) {
			const mid = Math.floor((left + right) / 2);
			recursiveMergeSort(left, mid);
			recursiveMergeSort(mid + 1, right);
			merge(left, mid, right);
		}
	};

	recursiveMergeSort(0, array.length - 1);

	for (let i = 0; i < array.length; i++) {
		array[i].isSorted = true;
		steps.push(array.map((item) => item.clone()));
	}

	return steps;
}
