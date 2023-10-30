<script lang="ts">
    // ================================
    // Imports
    // ================================
    import { SortItem } from "$lib/models/SortItem";
    import {
        bubbleSort,
        insertionSort,
        mergeSort,
        quickSort,
        selectionSort
    } from "$lib/algorithms/sorting";

    // ================================
    // Constants and Variables
    // ================================
    const algorithms = [
        { name: 'Bubble Sort', func: bubbleSort },
        { name: 'Selection Sort', func: selectionSort },
        { name: 'Insertion Sort', func: insertionSort },
        { name: 'Quick Sort', func: quickSort },
        { name: 'Merge Sort', func: mergeSort },
    ];

    // Array-related
    let arraySize = 20;
    let array: SortItem[] = getInitialArray();
    let currentStep = 0;
    let stepAmount = 0;

    // Animation and running status
    let animationSpeed = 200;
    let reversedAnimationSpeed = 200;
    let paused = false;
    let running = false;
    let selectedAlgorithm = algorithms[0].name;

    // ================================
    // Functions
    // ================================
    function getInitialArray(): SortItem[] {
        return Array.from({ length: arraySize }, () => new SortItem(Math.floor(Math.random() * 100 + 1)));
    }

    function generateNewArray() {
        array = getInitialArray();
        currentStep = 0;
    }

    function calculateAdjustedSpeed() {
        const MIN_SPEED = 0;
        const MAX_SPEED = 2000;
        const scaleFactor = Math.pow((reversedAnimationSpeed / 1000), 2);
        return MIN_SPEED + (1 - scaleFactor) * (MAX_SPEED - MIN_SPEED);
    }



    function animateAlgorithm(steps: SortItem[][]) {
        stepAmount = steps.length;
        const adjustedSpeed = calculateAdjustedSpeed();

        if (paused || !running) return;

        if (currentStep < steps.length) {
            array = steps[currentStep];
            currentStep++;
            const delay = array.some(item => item.isSwapping) ? adjustedSpeed + 100 : adjustedSpeed;
            setTimeout(() => animateAlgorithm(steps), delay);
        } else {
            running = false;
        }
    }

    function togglePauseResume() {
        paused = !paused;
        if (!paused && selectedAlgorithm) {
            const algorithmFunction = algorithms.find(a => a.name === selectedAlgorithm)?.func;
            if (algorithmFunction) {
                animateAlgorithm(algorithmFunction([...array]));
            }
        }
    }

    function stopSorting() {
        running = false;
        generateNewArray();
        currentStep = 0;
    }

    function startStopSorting() {
        if (running) {
            stopSorting();
        } else {
            running = true;
            const algorithmFunction = algorithms.find(a => a.name === selectedAlgorithm)?.func;
            if (algorithmFunction) {
                animateAlgorithm(algorithmFunction([...array]));
            }
        }
    }


    // ================================
    // Reactive Statements
    // ================================
    // Whenever arraySize changes, get a new array and reset current step
    $: if (arraySize) {
        array = getInitialArray();
        currentStep = 0;
    }

    // Recalculate animation speed
    $: animationSpeed = 520 - reversedAnimationSpeed;
</script>



<!-- App Layout -->
<div class="app-container class:running={running}">
    <div class="container">
        <h2>Sorting Visualizer</h2>

        <!-- Control Section -->
        <div class="controls">
            <div class="control-section sorting-algorithms">
                <h4>Choose Sorting Algorithm:</h4>
                <select bind:value={selectedAlgorithm}>
                    <option disabled selected value> -- select an algorithm -- </option>
                    {#each algorithms as algorithm}
                        <option value={algorithm.name}>{algorithm.name}</option>
                    {/each}
                </select>
                <button class={running ? 'stop-btn' : ''} on:click={startStopSorting} disabled={!selectedAlgorithm}>{running ? 'Stop' : 'Start'}</button>
            </div>

            <div class="control-section settings">
                <div class="tooltip" data-tip="Adjust the array size">
                    <label>Array Size: </label>
                    <input type="range" bind:value={arraySize} min="10" max="150" disabled={running}/>
                    <span>{arraySize}</span>
                </div>
                <div class="tooltip" data-tip="Adjust the animation speed">
                    <label>Speed: </label>
                    <input type="range" bind:value={reversedAnimationSpeed} min="0" max="1000" step="50" />
                </div>
            </div>

            <div class="control-section general-controls">
                <button on:click={togglePauseResume} class="pause-resume-btn" disabled={!running}>{paused ? 'Resume' : 'Pause'}</button>
                <button on:click={generateNewArray} class="new-array-btn">New Array</button>
            </div>


        </div>

        <!-- Current Visualization Info -->
        <div class="info-section">
            <div class="progress-bar">
                <div class="progress-bar-inner" style="width: {(currentStep/stepAmount)*100}%;"></div>
            </div>
        </div>

        <!-- Array Visualization -->
        <div class="array-display">
            {#each array as element}
                <div class="bar {element.isComparing ? 'comparing' : ''} {element.isSwapping ? 'swapping' : ''} {element.isPivot ? 'pivot' : ''} {element.isMin ? 'min' : ''} {element.isCurrent ? 'current' : ''} {element.isMerging ? 'merging' : ''} {element.isSorted ? 'sorted' : ''}" style="height: {element.value * 5}px"></div>
            {/each}
        </div>

        <!-- Color Key -->
        <div class="color-key">
            <h3>Key</h3>
            <div class="key-items">
                <div class="key-item comparing"></div> <span>Comparing</span>
                <div class="key-item swapping"></div> <span>Swapping</span>
                <div class="key-item sorted"></div> <span>Sorted</span>
                <div class="key-item current"></div> <span>Current Element</span>
                <div class="key-item min"></div> <span>Minimum Element</span>
                <div class="key-item pivot"></div> <span>Pivot (QuickSort)</span>
                <div class="key-item merging"></div> <span>Merging</span>
            </div>
        </div>
    </div>
</div>

<style>
    /* Reset and Basic Styles */
    * {
        font-family: 'Poppins', sans-serif;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        transition: all 0.3s;
        font-size: 16px;
    }

    .app-container {
        background-color: #fafbfc; /* Lighter shade for better contrast */
        padding: 1rem;
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: Arial, sans-serif;
        text-align: center;
    }

    .app-container.running {
        background-color: #E0E0E0;  /* light gray color when running */
    }

    .container {
        width: 80%;
        max-width: 1200px;
        color: #333;
        margin-bottom: 20px;
    }

    h2 {
        margin-bottom: .5rem;
        color: #2c3e50; /* Darker color for elegance */
        font-weight: 700;
    }

    /* Controls Styles */
    .controls {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
    }


    .control-section {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap; /* Wrap controls in smaller screens */
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 10px;
    }

    button {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 5px;
        min-width: 120px;
        font-weight: 500;
        cursor: pointer;
        background-color: #4a90e2; /* Fresh blue color */
        color: #ffffff;
        box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
        transition: all 0.25s;
    }

    button:hover {
        background-color: #357ab7; /* Darker shade of blue on hover */
        transform: translateY(-2px);
        box-shadow: 0 7px 15px rgba(0, 0, 0, 0.2);
    }

    label {
        font-weight: 600;
        margin-right: 10px;
    }

   input[type="range"] {
        padding: 0.5rem;
        border-radius: 5px;
        border: 1px solid #dcdde1;
        width: 100%;
    }

    /* Array Display */
    .array-display {
        display: flex;
        align-items: flex-end;
        height: 60vh;
        max-height: 50vh;
        gap: 2px;
        border: 1px solid #bbb;
        padding: 10px;
        border-radius: 10px;
        margin-top: 1rem;
    }

    .bar {
        flex: 1;
        background-color: #95a5a6; /* Neutral shade for default bars */
        margin: 1px;
        border-radius: 3px 3px 0 0;
    }

    /* Coloring based on comparison, swapping, etc. */
    .comparing { background-color: #f39c12; } /* Orange for comparison */
    .swapping { background-color: #e74c3c; } /* Red for swapping */
    .sorted { background-color: #27ae60; } /* Green for sorted elements */
    .current { background-color: #9b59b6; } /* Purple for current element */
    .min { background-color: #3498db; } /* Blue for minimum element */
    .pivot { background-color: #f1c40f; } /* Yellow for pivot in quicksort */
    .merging { background-color: #e67e22; } /* Different shade of orange for merge */

    /* Info Section */
    .info-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    /* Tooltip styling */
    .tooltip {
        position: relative;
        display: inline-block;
        cursor: pointer;
        margin-bottom: 0.5rem;
    }

    .tooltip:hover:after {
        content: attr(data-tip);
        position: absolute;
        bottom: -25px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #555;
        color: #fff;
        padding: 0.3rem 0.6rem;
        border-radius: 5px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 1;
    }

    .color-key {
        margin-top: .5rem;
        border-top: 1px solid #dcdde1;
        padding-top: .5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    h3 {
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        color: #34495e;
    }

    .key-items {
        display: flex;
        gap: .5rem;
        flex-wrap: wrap;
    }

    .key-item {
        width: 20px;
        height: 20px;
        border-radius: 3px;
        margin-right: 0.3rem;
    }

    span {
        margin-right: 1rem;
        font-weight: 500;
    }

    .sorting-algorithms {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .sorting-algorithms h4 {
        margin-bottom: 10px;
        font-size: 18px;
        color: #666;
    }

    .sorting-algorithms select {
        padding: 8px 10px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 5px;
        margin-bottom: 15px;
        width: 100%;
        box-sizing: border-box;
        appearance: none;
        background-color: #fff;
        cursor: pointer;
    }

    .sorting-algorithms select:focus {
        outline: none;
        border-color: #007BFF;
        box-shadow: 0 0 3px #007BFF66;
    }

    .sorting-algorithms button {
        padding: 10px 15px;
        font-size: 16px;
        color: #fff;
        background-color: #007BFF;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .sorting-algorithms button:hover {
        background-color: #0056b3;
    }

    .sorting-algorithms button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
    }

    .pause-resume-btn {
        background-color: #e74c3c;
    }

    .new-array-btn {
        background-color: #2c3e50;
    }
    /* Range Styles */
    input[type="range"] {
        -webkit-appearance: none;
        width: 100%;
        height: 8px;
        background: #ddd;
        border-radius: 5px;
        outline: none;
        padding: 0;
        margin: 10px 0;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #4a90e2;
        border-radius: 50%;
        cursor: pointer;
        transition: background 0.2s;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        background: #357ab7;
    }

    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #4a90e2;
        border-radius: 50%;
        cursor: pointer;
    }

    input[type="range"]::-moz-range-thumb:hover {
        background: #357ab7;
    }

    input[type="range"]::-ms-thumb {
        width: 20px;
        height: 20px;
        background: #4a90e2;
        border-radius: 50%;
        cursor: pointer;
    }

    /* Start Button Styles */
    .sorting-algorithms button {
        font-size: 16px;
        padding: 10px 15px;
        border-radius: 8px;
        border: none;
        background-color: #4a90e2;
        color: white;
        cursor: pointer;
        transition: background-color 0.3s ease, transform 0.3s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    .sorting-algorithms button:hover {
        background-color: #357ab7;
        transform: translateY(-3px);
    }

    .sorting-algorithms button:active {
        transform: translateY(-1px);
    }


    .progress-bar {
        width: 100%;
        height: 20px;
        background-color: #dcdde1;
        border-radius: 5px;
        overflow: hidden;
        margin: 1rem 0;
    }

    .progress-bar-inner {
        height: 100%;
        width: 0;
        background-color: #4a90e2;
        transition: width 0.3s;
    }

    .stop-btn {
        background-color: #c0392b;
    }

    .stop-btn:hover {
        background-color: #a12719;
    }

    button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
        box-shadow: none;
    }

    button:disabled:hover {
        transform: none;
        background-color: #cccccc;
    }



    /* Responsiveness */
    @media (max-width: 768px) {
        .key-items {
            justify-content: center;
        }

        span {
            margin-right: 1rem;
        }
    }
</style>
