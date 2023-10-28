<script>
    import {Grid} from '$lib/components';
</script>

<style>
    .grid-wrapper {
        max-width: 800px;
        margin: 0 auto; /* Centers the grid horizontally */
        text-align: center; /* Centers the button and the header */
        padding: 20px;
        font-family: 'Arial', sans-serif; /* Using a simple font, you can change to any preferred font */
    }

    h1 {
        margin-bottom: 20px;
        font-size: 24px;
        color: #333;
    }

    p {
        margin-bottom: 20px;
        color: #555;
    }
</style>

<div class="grid-wrapper">
    <h1>Pathfinding Visualizer</h1>
    <p>Click and drag to set walls, start, and end points. Then, click "Start Pathfinding" to visualize the shortest path.</p>

</div>
<Grid />
