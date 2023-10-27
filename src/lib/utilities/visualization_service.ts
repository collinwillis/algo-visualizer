// visualizationService.ts

import type { SortingAlgorithm } from '$lib/algorithms/sorting';
import { bubbleSort, heapSort, mergeSort, quickSort, selectionSort } from '$lib/algorithms/sorting';
import { get } from 'svelte/store';
import { speed } from '$lib/store/sorting_store';
import { SortElement } from '$lib/models/SortElement';

const DEFAULT_COLOR = '#282c34'; // Charcoal
const SWAP_COLOR = '#e63946'; // Crimson Red
const COMPARE_COLOR = '#0077b6'; // Steel Blue
const PIVOT_COLOR = '#f4a261'; // Sandy Brown
const LEFT_GROUP_COLOR = '#8e44ad'; // Purple
const RIGHT_GROUP_COLOR = '#e76f51'; // Burnt Sienna
const MERGED_GROUP_COLOR = '#2a9d8f'; // Persian Green
const HEAP_COLOR = '#f39c12';
// Purple

// Burnt Sienna
// Belize Hole

type UpdateCallback = (arr: SortElement[]) => void;

function visualizeUpdate(
	arr: SortElement[],
	indices: number[],
	colors: string[],
	updateCallback: UpdateCallback
) {
	const updatedArray = arr.map((item, index) => {
		const position = indices.indexOf(index);
		return position !== -1 ? new SortElement(item.value, colors[position], item.groupColor) : item;
	});

	updateCallback(updatedArray);
	restoreDefaultColors(updateCallback, updatedArray);
}

export const visualizeBubbleSortUpdate = (arr: SortElement[], updateCallback: UpdateCallback) => {
	return (modifiedArr: SortElement[], a: number, b: number) => {
		const colors =
			modifiedArr[a].value > modifiedArr[b].value
				? [COMPARE_COLOR, SWAP_COLOR]
				: [COMPARE_COLOR, COMPARE_COLOR];
		visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
	};
};

export const visualizeSelectionSortUpdate = (
	arr: SortElement[],
	updateCallback: UpdateCallback
) => {
	return (modifiedArr: SortElement[], a: number, b: number) => {
		const colors = [COMPARE_COLOR, SWAP_COLOR];
		visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
	};
};

export const visualizeQuickSortUpdate = (arr: SortElement[], updateCallback: UpdateCallback) => {
	return (modifiedArr: SortElement[], a: number, b: number, pivotIndex?: number) => {
		const indices = [a, b];
		const colors = [SWAP_COLOR, SWAP_COLOR];

		if (pivotIndex !== undefined) {
			indices.push(pivotIndex);
			colors.push(PIVOT_COLOR);
		}

		visualizeUpdate(modifiedArr, indices, colors, updateCallback);
	};
};

export const visualizeInsertionSortUpdate = (
	arr: SortElement[],
	updateCallback: UpdateCallback
) => {
	return (modifiedArr: SortElement[], a: number, b: number) => {
		const colors = [COMPARE_COLOR, SWAP_COLOR];
		visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
	};
};

export const visualizeMergeSortUpdate = (arr: SortElement[], updateCallback: UpdateCallback) => {
	return (
		modifiedArr: SortElement[],
		leftIndex: number,
		midIndex: number, // New argument to determine the boundary between left and right groups
		mergedIndex: number,
		isComparison: boolean
	) => {
		const updatedArray = modifiedArr.map((item, index) => {
			const isLeftGroup = index >= leftIndex && index <= midIndex; // Updated condition
			const isRightGroup = index > midIndex && index <= mergedIndex; // Updated condition

			if (isLeftGroup || isRightGroup) {
				const groupColor = isLeftGroup ? LEFT_GROUP_COLOR : RIGHT_GROUP_COLOR;
				const actionColor = isComparison ? COMPARE_COLOR : MERGED_GROUP_COLOR;
				// Inside visualizeMergeSortUpdate function
				console.log(`Setting groupColor for index ${index}: ${groupColor}`);

				return new SortElement(item.value, actionColor, groupColor);
			}
			console.log(`leftIndex: ${leftIndex}, midIndex: ${midIndex}, mergedIndex: ${mergedIndex}`);

			return item;
		});

		updateCallback(updatedArray);
		restoreDefaultColors(updateCallback, updatedArray);
	};
};

export const visualizeHeapSortUpdate = (arr: SortElement[], updateCallback: UpdateCallback) => {
	return (modifiedArr: SortElement[], a: number, b: number, isHeapifying: boolean) => {
		const colors = isHeapifying ? [HEAP_COLOR, HEAP_COLOR] : [SWAP_COLOR, SWAP_COLOR];
		visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
	};
};

function restoreDefaultColors(updateCallback: UpdateCallback, arrayWithColors: SortElement[]) {
	const speedValue = get(speed);
	setTimeout(() => {
		updateCallback(
			arrayWithColors.map((item) => new SortElement(item.value, DEFAULT_COLOR, DEFAULT_COLOR))
		);
	}, speedValue);
}

export const getVisualizer = (algorithm: SortingAlgorithm) => {
	switch (algorithm) {
		case bubbleSort:
			return visualizeBubbleSortUpdate;
		case selectionSort:
			return visualizeSelectionSortUpdate;
		case quickSort:
			return visualizeQuickSortUpdate;
		case mergeSort:
			return visualizeMergeSortUpdate;
		case heapSort:
			return visualizeHeapSortUpdate;
		default:
			return visualizeInsertionSortUpdate;
	}
};
