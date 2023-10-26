
export type SortingAlgorithm = (arr: number[], speed: number, callback: (arr: number[], a: number, b: number, c?: number) => void) => Promise<number[]>;
export const bubbleSort: SortingAlgorithm = async (arr, speed, callback) => {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            callback(arr, j, j + 1); // Visualize comparison
            await sleep(speed);
            if (arr[j] > arr[j + 1]) {
                // Swapping
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                callback(arr, j, j + 1);  // Call the callback with the current array and swapped indices
                await sleep(speed);  // Sleep for some time to show the visualization
            }
        }
    }
    return arr;
}


export const selectionSort: SortingAlgorithm = async (arr, speed, callback) => {
    const len = arr.length;
    for (let i = 0; i < len - 1; i++) {
        let minIndex = i;
        callback(arr, minIndex, minIndex); // Visualize initial minimum
        await sleep(speed);
        for (let j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {
                minIndex = j;
                callback(arr, minIndex, i);  // Visualize new minimum
                await sleep(speed);
            }
        }
        if (minIndex !== i) {
            [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
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
        const pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            callback(arr, i, j, high); // Visualize current comparison with the pivot
            await sleep(speed);
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
                callback(arr, i, j, high);  // Call the callback with the current array and swapped indices
                await sleep(speed);
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
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
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            callback(arr, i, j);  // Visualize the shift
            await sleep(speed);
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
};

export const mergeSort: SortingAlgorithm = async (arr, speed, callback) => {
    const len = arr.length;
    if (len <= 1) return arr;

    const mid = Math.floor(len / 2);
    const leftArr = arr.slice(0, mid);
    const rightArr = arr.slice(mid);

    await Promise.all([
        mergeSort(leftArr, speed, callback),
        mergeSort(rightArr, speed, callback)
    ]);

    return await merge(arr, speed, leftArr, rightArr, callback);
};

const merge = async (
    arr: number[],
    speed: number,
    leftArr: number[],
    rightArr: number[],
    callback: (arr: number[], a: number, b: number, c: number) => void
): Promise<number[]> => {
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < leftArr.length && j < rightArr.length) {
        callback(arr, i, j, k);
        await sleep(speed);
        if (leftArr[i] < rightArr[j]) {
            arr[k++] = leftArr[i++];
        } else {
            arr[k++] = rightArr[j++];
        }
    }

    while (i < leftArr.length) {
        callback(arr, i, j, k);
        await sleep(speed);
        arr[k++] = leftArr[i++];
    }

    while (j < rightArr.length) {
        callback(arr, i, j, k);
        await sleep(speed);
        arr[k++] = rightArr[j++];
    }

    return arr;
};

export function sleep(speed: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, speed));
}

export const getAlgorithm = (algorithm: string) => {
    switch (algorithm) {
        case "bubbleSort":
            return bubbleSort;
        case "selectionSort":
            return selectionSort;
        case "quickSort":
            return quickSort;
        case "mergeSort":
            return mergeSort;
        default:
            return insertionSort;
    }
};
