<script lang="ts">
    import TextButton from "../../TextButton/TextButton.svelte";
    import {type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState, appStateV2, TaskUpdateTrigger} from "../../../../state/appState.svelte";
    import Chip from "../../Chip/Chip.svelte";

    let dialog: any = $state();

    let newTaskName: string | undefined = $state();
    let newTaskEstimate: number | undefined = $state();
    let newTaskPriority = $state<undefined | 'low' | 'medium' | 'high'>(undefined);

    let targetTask: Task
    let errorMessage: string | undefined = $state();

    async function handleSubmit () {

        console.log("Submit Called")

        await invoke("update_task", {taskId: appState.editTaskInfo.taskId, newName: newTaskName, newEstimate: newTaskEstimate, newPriority: newTaskPriority });


        if (appState.editTaskInfo.taskId !== undefined) {
            appStateV2.triggerUpdateTask(appState.editTaskInfo.taskId)
        }
        handleClose()
    }

    async function getTask () {
        if (!appState.editTaskInfo.taskId) return;
        targetTask = await invoke<Task>("get_task", {taskId: appState.editTaskInfo.taskId });
        console.log(targetTask);


        newTaskName = targetTask.name;
        newTaskEstimate = targetTask.estimatedhours;
        newTaskPriority = targetTask.priority;
    }

    function checkUpdateBtnDisabled () {
        return newTaskName == targetTask?.name && newTaskEstimate == targetTask?.estimatedhours && newTaskPriority == targetTask?.priority;
    }

    function handleClose () {
        appState.editTaskInfo.isEditTaskModalOpen = false;

        appState.editTaskInfo.taskId = undefined

        newTaskName = undefined;
        newTaskEstimate = undefined;
        newTaskPriority = undefined;

        errorMessage = undefined;

        if (targetTask != undefined && targetTask.id != undefined) {
            TaskUpdateTrigger.taskUpdateIdTrigger === targetTask.id
        }
        dialog.close();
    }

    $effect(() => {
        if (appState.editTaskInfo.isEditTaskModalOpen && appState.editTaskInfo.taskId != undefined) {
            getTask()
            dialog.showModal()
        }
    });
</script>

<dialog
        class="modal-container"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">Update Task</h2>
        </div>
        <div class="modal-content">
            <div class="form-group">
                <label for="projectname">Task Name</label>
                <input class="modal-input" id="projectname" type="text" placeholder="Task Name" bind:value={newTaskName}/>
            </div>
            <div class="form-group">
                <label for="projectdeadline">Estimate</label>
                <input class="modal-input" id="projectdeadline" type="number" placeholder="Estimate" bind:value={newTaskEstimate}/>
            </div>
            <div class="form-group">
                <label for="projectpriority">Priority</label>
                <div class="select">
                    <Chip text="Low" priority="low" active={newTaskPriority === 'low'} clickAction={() => newTaskPriority = 'low'}> </Chip>
                    <Chip text="Medium" priority="medium" active={newTaskPriority === 'medium'} clickAction={() => newTaskPriority = 'medium'}> </Chip>
                    <Chip text="High" priority="high" active={newTaskPriority === 'high'} clickAction={() => newTaskPriority = 'high'}> </Chip>
                </div>
            </div>
            {#if errorMessage}
                <div class="modal-warning">{errorMessage}</div>
            {/if}
        </div>
        <div class="modal-footer">
            <TextButton kind="bright" size="small" text="Update" clickAction={() => handleSubmit()} isDisabled={checkUpdateBtnDisabled()}></TextButton>
            <TextButton kind="transparent" size="small" text="Cancel" clickAction={() => handleClose()}></TextButton>
        </div>
    </div>
</dialog>