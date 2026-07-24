<script lang="ts">
    import "./Stopwatch.css"

    let {
        taskid,
    } = $props();

    let countTime = $state(0);

    let isTimerRunning = $state(false);

    let intervalId: number | undefined = undefined;
    let startTime = 0;
    let accumulated = 0;

    async function start() {
        isTimerRunning = true;
        startTime = performance.now();
        intervalId = setInterval(() => {
            countTime = accumulated + (performance.now() - startTime);
        }, 250);

        let now = new Date(Date.now())
        let past = new Date(Date.UTC(2020,1))

        console.log("start time: ", formatDuration(now.getTime() - past.getTime()));

        // await invoke<Project>("update_task_active" , { taskId: taskid, active: isTimerRunning, lastStarted: startTime });
    }

    async function pause() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        accumulated += performance.now() - startTime;
        countTime = accumulated;
        clearInterval(intervalId);
        intervalId = undefined;

        console.log("accumulated: ", accumulated);
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

    function formatDuration(ms: number): string {
        const totalSeconds = Math.floor(Math.abs(ms) / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const years = Math.floor(days / 365);
        const remainingDays = days % 365;
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${years}y ${remainingDays}d ${hours}h ${minutes}m ${seconds}s`;
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