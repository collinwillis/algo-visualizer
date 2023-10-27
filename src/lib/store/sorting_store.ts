import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const speed: Writable<number> = writable(400); // Default speed value

export const selectedAlgorithm: Writable<string> = writable('bubbleSort');
