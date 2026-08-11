<script lang="ts">
    import "./Stopwatch.css"
    import {untrack} from "svelte";
    import type {TaskTimeInfo} from "../../types/types";
    import {invoke} from "@tauri-apps/api/core";

    let {
        taskid,
    } = $props();

    let tasktimeinfo = $state<TaskTimeInfo>();

    let countTime = $state(0);

    let isTimerRunning = $state(false);

    let intervalId: number | undefined = undefined;
    let startTime = 0;
    let accumulated = 0;

    async function start() {
        isTimerRunning = true;

        if (tasktimeinfo?.laststarted !== undefined && tasktimeinfo?.active) {
            startTime = tasktimeinfo.laststarted;
        } else  startTime = Date.now();

        intervalId = setInterval(() => {
            countTime = accumulated + (Date.now() - startTime);
        }, 250);

        if (!(tasktimeinfo?.active)) {
            await invoke("update_task_active" , { taskId: taskid, active: true, lastStarted:  Math.floor(startTime) });
        }
    }

    async function pause() {
        if (!isTimerRunning) return;
        isTimerRunning = false;
        accumulated += Date.now() - startTime;
        countTime = accumulated;
        clearInterval(intervalId);
        intervalId = undefined;
        startTime = 0

        await invoke("update_task_pause_time", {taskId: taskid, accumulated: Math.floor(accumulated)})
    }

    async function toggleStopwatch() {
        if (!isTimerRunning) {
            await start()
        }
        else if (isTimerRunning) {
            await pause()
        }
    }

    function resetLocal() {
        isTimerRunning = false;
        clearInterval(intervalId);
        intervalId = undefined;
        startTime = 0;
        countTime = 0;
        accumulated = 0;
    }

    async function reset() {
        resetLocal();
        await invoke("update_task_time_reset", { taskId: taskid });

        await loadAndSync();
    }

    async function submit() {
        if (tasktimeinfo) {
            await invoke("update_task_time_worked" , { taskId: taskid, newTimeWorked: tasktimeinfo.milisecworked + Math.floor(accumulated) });
        }
        await reset()
    }

    async function loadAndSync() {
        resetLocal();
        await loadTaskTimeData();

        console.log(tasktimeinfo?.accumulated);
        if (tasktimeinfo?.accumulated !== undefined && tasktimeinfo?.accumulated !== null) {
            accumulated = tasktimeinfo?.accumulated;
            countTime = accumulated;
        }
        if (tasktimeinfo?.active === true) {
            await start();
        }
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

    async function loadTaskTimeData() {
        tasktimeinfo = await invoke<TaskTimeInfo>("get_task_time_info" , { taskId: taskid });
    }

    $effect(() => {
        if (taskid !== undefined) {
            untrack(() => {
                loadAndSync();
                $inspect(tasktimeinfo)
                $inspect(isTimerRunning)
                console.log( countTime );
            });
        }
    });


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
            <button class="stopwatch-btn secondary" disabled={isTimerRunning || countTime === 0} onclick={submit}>
                Submit
            </button>
            <button class="stopwatch-btn secondary" disabled={isTimerRunning || (countTime === 0)} onclick={reset}>
                Reset
            </button>
        </div>
    </div>
</div>