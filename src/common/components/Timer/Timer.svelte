<script lang="ts">
    import "./Timer.css"
    import IconButton from "../IconButton/IconButton.svelte";

    //TODO TImer does not bubble up complete to parent elem

    let { onSubmit } = $props<{onSubmit?: (time: number) => void;}>();

    let isTimerRunning = $state(false);
    let countTime = $state(0);

    let intervalId: number | undefined = undefined;
    let startTime = 0;
    let accumulated = 0;

    function start() {
        isTimerRunning = true;
        startTime = performance.now();
        intervalId = setInterval(() => {
            countTime = accumulated + (performance.now() - startTime);
        }, 250);
    }

    function pause() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        accumulated += performance.now() - startTime;
        countTime = accumulated;
        clearInterval(intervalId);
        intervalId = undefined;
    }

    function toggleStopwatch() {
        if (!isTimerRunning) {
            start()
        }
        else if (isTimerRunning) {
            pause()
        }
    }

    function reset() {
        isTimerRunning = false;
        clearInterval(intervalId);
        intervalId = undefined;
        countTime = 0;
        accumulated = 0;
    }

    function format(ms: number) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return (
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0')
        );
    }

</script>

<div class="timer" class:running = {isTimerRunning}>
    <IconButton kind="transparent" size="small" icon="stop" clickAction={() => reset()} isDisabled={isTimerRunning} title="Submit Time Worked"></IconButton>
    <IconButton kind="transparent" size="small" icon="play" toggleIcon="pause" isToggled={isTimerRunning} clickAction={() => toggleStopwatch()} title="Start/Stop"></IconButton>
    {format(countTime)}
</div>