<script lang="ts">
    import "./Stopwatch.css"

    let {
        taskid,
        lastStarted,
        isTimerRunning,
    } = $props();

    let countTime = $state(0);

    let intervalId: number | undefined = undefined;
    let startTime = 0;
    let accumulated = 0;

    async function start() {
        isTimerRunning = true;
        startTime = performance.now();
        intervalId = setInterval(() => {
            countTime = accumulated + (performance.now() - startTime);
        }, 250);

        console.log("start time: ", startTime);

        // await invoke<Project>("update_task_active" , { taskId: taskid, active: isTimerRunning, lastStarted: startTime });
    }

    async function pause() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        accumulated += performance.now() - startTime;
        countTime = accumulated;
        clearInterval(intervalId);
        intervalId = undefined;
    }

    async function toggleStopwatch() {
        if (!isTimerRunning) {
            await start()
        }
        else if (isTimerRunning) {
            await pause()
        }
    }

    async function reset() {
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

<div class="stopwatch" class:running={isTimerRunning}>
    <div class="stopwatch-left">
        <span>STOPWATCH - SESSION</span>
        <span class="stopwatch-time">{format(countTime)}</span>
        <span>total 11h / 24h est</span>
    </div>
    <div class="stopwatch-right">
        <button class="stopwatch-btn main" onclick={toggleStopwatch}>
            {isTimerRunning ? 'Stop' : 'Start'}
        </button>
        <div class="stopwatch-actions-bottom">
            <button class="stopwatch-btn secondary" disabled={isTimerRunning || countTime === 0}>
                Submit
            </button>
            <button class="stopwatch-btn secondary" disabled={isTimerRunning || (countTime === 0)} onclick={reset}>
                Reset
            </button>
        </div>
    </div>
</div>