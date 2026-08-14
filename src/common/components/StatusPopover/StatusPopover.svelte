<script lang="ts">
    import "./StatusPopover.css"
    import {getIcon, type IconEnum, type Status, type Task} from "../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appStateV2} from "../../../state/appState.svelte";
    import Pill from "../Pill/Pill.svelte";

    let {
        statusState = $bindable<Status>('incompleted'),
        taskid,
        parenttaskid
    } = $props<{
        statusState: Status;
        taskid: string;
        parenttaskid: string;
    }>();

    let isPopoverOpened = $state<boolean>(false);
    let newStatus = $state(statusState);
    let icon = $state<IconEnum>('chevrondown');

    async function stateChanged() {
        if (statusState != newStatus) {
            console.log(newStatus);
            await invoke<Task[]>("update_task_status", { taskId: taskid, status: newStatus });
            statusState = newStatus
            appStateV2.triggerUpdateTask(parenttaskid)
        }
        isPopoverOpened = false;
    }

    let IconComponent = $state<any>(null);

    $effect(() => {
        if (isPopoverOpened) {
            icon = 'chevronright'
        } else {
            icon = 'chevrondown'
        }

        getIcon('small', icon).then(c => IconComponent = c);
    });

</script>

<div class="status-wrap">
    <button class="status-popover-btn {statusState}" onclick={() => isPopoverOpened = !isPopoverOpened}>
        {statusState.charAt(0).toUpperCase() + statusState.slice(1)}
        {#if IconComponent}
            <IconComponent />
        {/if}
    </button>
    {#if isPopoverOpened }
        <div class="status-popover">
            <button class="popover-pill-btn" onclick={() => {newStatus = "completed";  stateChanged()}}>
                <Pill pillstate="completed" text="Completed"></Pill>
            </button>
            <button class="popover-pill-btn" onclick={() => {newStatus = "incompleted";  stateChanged()}}>
                <Pill pillstate="incompleted" text="Incompleted"></Pill>
            </button>
            <button class="popover-pill-btn" onclick={() => {newStatus = "blocked";  stateChanged()}}>
                <Pill pillstate="blocked" text="Blocked"></Pill>
            </button>
        </div>
    {/if}
</div>