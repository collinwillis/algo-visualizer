// visualizationService.ts

import type {SortingAlgorithm} from "$lib/algorithms/sorting";
import {bubbleSort, mergeSort, quickSort, selectionSort} from "$lib/algorithms/sorting";
import {get} from "svelte/store";
import {speed} from "$lib/store/sorting_store";

const DEFAULT_COLOR = '#2c3e50';
const SWAP_COLOR = '#e74c3c';
const COMPARE_COLOR = '#3498db';
const PIVOT_COLOR = '#f39c12';

type VisualElement = {
    value: number;
    color: string;
};

type UpdateCallback = (arr: VisualElement[]) => void;

function visualizeUpdate(arr: number[], indices: number[], colors: string[], updateCallback: UpdateCallback) {
    const arrayWithColors = arr.map((item, index) => {
        const position = indices.indexOf(index);
        return { value: item, color: position !== -1 ? colors[position] : DEFAULT_COLOR };
    });

    updateCallback(arrayWithColors);
    restoreDefaultColors(updateCallback, arrayWithColors);
}

export const visualizeBubbleSortUpdate = (arr: number[], updateCallback: UpdateCallback) => {
    return (modifiedArr: number[], a: number, b: number) => {
        const colors = modifiedArr[a] > modifiedArr[b] ? [COMPARE_COLOR, SWAP_COLOR] : [COMPARE_COLOR, COMPARE_COLOR];
        visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
    };
};

export const visualizeSelectionSortUpdate = (arr: number[], updateCallback: UpdateCallback) => {
    return (modifiedArr: number[], a: number, b: number) => {
        const colors = [COMPARE_COLOR, SWAP_COLOR];
        visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
    };
};

export const visualizeQuickSortUpdate = (arr: number[], updateCallback: UpdateCallback) => {
    return (modifiedArr: number[], a: number, b: number, pivotIndex?: number) => {
        const indices = [a, b];
        const colors = [SWAP_COLOR, SWAP_COLOR];

        if (pivotIndex !== undefined) {
            indices.push(pivotIndex);
            colors.push(PIVOT_COLOR);
        }

        visualizeUpdate(modifiedArr, indices, colors, updateCallback);
    };
};

export const visualizeInsertionSortUpdate = (arr: number[], updateCallback: UpdateCallback) => {
    return (modifiedArr: number[], a: number, b: number) => {
        const colors = [COMPARE_COLOR, SWAP_COLOR];
        visualizeUpdate(modifiedArr, [a, b], colors, updateCallback);
    };
};

export const visualizeMergeSortUpdate = (
    arr: number[],
    updateCallback: UpdateCallback
) => {
    return (modifiedArr: number[], leftIndex: number, rightIndex: number, mergedIndex: number) => {
        const indices = [leftIndex, rightIndex, mergedIndex];
        const colors = [COMPARE_COLOR, COMPARE_COLOR, SWAP_COLOR];
        visualizeUpdate(modifiedArr, indices, colors, updateCallback);
    };
};

function restoreDefaultColors(updateCallback: UpdateCallback, arrayWithColors: VisualElement[]) {
    const speedValue = get(speed);
    setTimeout(() => {
        updateCallback(arrayWithColors.map(item => ({ value: item.value, color: DEFAULT_COLOR })));
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
        default:
            return visualizeInsertionSortUpdate;
    }
};





