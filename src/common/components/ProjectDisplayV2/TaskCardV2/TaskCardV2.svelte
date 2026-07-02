<script lang="ts">
    import "./TaskCardV2.css"

    import type {ITaskCard} from "../../../types/types";
    import IconButton from "../../IconButton/IconButton.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {TaskPageState} from "../../../../state/appState.svelte";

    let {
        id,
        name,
        color,
        active,
        priority,
        status,
        totaltasks,
        completedtasks,
    }: ITaskCard = $props();

    function getCompletionPercent() {
        if (totaltasks > 0) {
            return Math.round((completedtasks / totaltasks) * 100).toString() + "%";
        } else return "0%";
    }

    function handleTaskSelected() {
        if (TaskPageState.selectedTask === id) {
            TaskPageState.selectedTask = undefined;
        }
        else TaskPageState.selectedTask = id
    }

</script>

<div class="task-containerV2"
     class:selected={TaskPageState.selectedTask === id}
     role="none"
     onclick={() => handleTaskSelected()}
>
    <div class="task-card-left">
        <div class="task-color" style="--project-color: var(--stratum-{color})"></div>
        <div class="task-priority-bubble"></div>
        <div class="task-info">
            <div class="task-name">{name}</div>
            <div class="task-metadata">
                <span class="task-priority">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
                -
                <span class="task-priority">
                    {#if completedtasks > 0 }
                        {getCompletionPercent()} done
                    {:else}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    {/if }
                </span>
            </div>
        </div>
    </div>
    <div class="task-card-right" role="none" onclick={(e) => e.stopPropagation()}>
        {#if totaltasks > 0}
            <Pill text={totaltasks.toString()}></Pill>
            <IconButton icon="chevronright" kind="transparent" size="small"></IconButton>
        {/if}
    </div>
</div>