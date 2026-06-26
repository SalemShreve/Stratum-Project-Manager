<script lang="ts">
    import "./StatusPopover.css"
    import IconButton from "../IconButton/IconButton.svelte";
    import type {Status, Task} from "../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import Icon from "../Icon/Icon.svelte";

    let {
        statusState = $bindable<Status>('incompleted'),
        taskid
    } = $props<{
        statusState: Status;
        taskid: string;
    }>();

    let isPopoverOpened = $state<boolean>(false);
    let newStatus = $state(statusState);

    async function stateChanged() {
        if (statusState != newStatus) {
            console.log(newStatus);
            await invoke<Task[]>("update_task_status", { taskId: taskid, status: newStatus });
            statusState = newStatus
        }
        isPopoverOpened = false;
    }

</script>

<div class="status-wrap">
<!--    <Icon kind="transparent" size="small" icon={statusState}></Icon>-->
    <IconButton kind="transparent" size="small" icon={statusState} title="Status Select" clickAction={() => isPopoverOpened = !isPopoverOpened} />
    {#if isPopoverOpened }
        <div class="status-popover">
            <IconButton kind="transparent" size="small" icon="completed" title="Complete" clickAction={() => {newStatus = "completed";  stateChanged()}} />
            <IconButton kind="transparent" size="small" icon="incompleted" title="Incomplete" clickAction={() => {newStatus = "incompleted";  stateChanged()}} />
            <IconButton kind="transparent" size="small" icon="blocked" title="Blocked" clickAction={() => {newStatus = "blocked";  stateChanged()}} />
        </div>
    {/if}
</div>