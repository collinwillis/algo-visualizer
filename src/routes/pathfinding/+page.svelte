<script>
    import {Grid} from '$lib/components';
</script>

<style>
    :root {
        --primary-bg-color: #1E1E2F;
        --primary-font-color: #FFFFFF;
        --secondary-color: #007BFF;
        --error-color: #E91E63;
        --start-color: #4CAF50;
        --font-family: 'Poppins', sans-serif;
    }

    body {
        font-family: var(--font-family);
        background-color: var(--primary-bg-color);
        color: var(--primary-font-color);
    }

    .grid-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    h1 {
        font-size: 2.5em;
        margin-bottom: 1em;
    }

    p {
        margin-bottom: 1.5em;
        max-width: 600px;
        text-align: center;
        opacity: 0.8;
    }

    button {
        padding: 12px 24px;
        background-color: var(--secondary-color);
        border: none;
        border-radius: 4px;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        font-weight: 500;
        color: var(--primary-font-color);
    }

    button:hover {
        background-color: darken(var(--secondary-color), 15%);
        transform: translateY(-2px);
    }

    button:active {
        transform: translateY(1px);
    }
</style>

<div class="grid-wrapper">
    <h1>Pathfinding Visualizer</h1>
    <p>Click and drag to set walls, start, and end points. Then, click "Start Pathfinding" to visualize the shortest path.</p>
    <Grid />
</div>

