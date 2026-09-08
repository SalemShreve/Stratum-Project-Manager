<script lang="ts">
    import "./TaskCardV2.css"

    import type {ITaskCard} from "../../../types/types";
    import IconButton from "../../IconButton/IconButton.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {capitalize} from "../../../utils/utils";

    let {
        id,
        name,
        color,
        active,
        priority,
        status,
        totaltasks,
        completedtasks,
        selectedTaskId = $bindable()
    }: ITaskCard & { selectedTaskId?: string } = $props();

    function getCompletionPercent() {
        if (totaltasks > 0) {
            return Math.round((completedtasks / totaltasks) * 100).toString() + "%";
        } else return "0%";
    }

    function handleTaskSelected() {
        if (selectedTaskId === id) {
            selectedTaskId = undefined;
        }
        else selectedTaskId = id
    }

</script>

<div class="task-containerV2"
     class:selected={selectedTaskId === id}
     role="none"
     onclick={() => handleTaskSelected()}>
    <div class="task-card-left">
        <div class="task-color" style="--project-color: var(--stratum-{color})"></div>
        <div class="task-priority-bubble"></div>
        <div class="task-info">
            <div class="task-name {status}">{name}</div>
            <div class="task-metadata">
                <span class="task-priority">{capitalize(priority)}</span>
                -
                <span class="task-priority">
                    {#if completedtasks > 0 }
                        {getCompletionPercent()} done
                    {:else}
                        {capitalize(status)}
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