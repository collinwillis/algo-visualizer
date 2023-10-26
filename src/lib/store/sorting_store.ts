import { writable } from 'svelte/store';
import type { Writable } from 'svelte/store';
import { bubbleSort } from "$lib/algorithms/sorting";  // Ensure this import is correct and comes before selectedAlgorithm initialization
import type { SortingAlgorithm } from "$lib/algorithms/sorting";

export const speed: Writable<number> = writable(400);  // Default speed value

export const selectedAlgorithm: Writable<SortingAlgorithm> = writable(bubbleSort);
