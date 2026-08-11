<script lang="ts">
    import "./NewTaskModal.css"
    import TextButton from "../../TextButton/TextButton.svelte";
    import {type Task} from "../../../types/types";
    import Chip from "../../Chip/Chip.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let dialog: any = $state();

    let newTaskName: string | undefined = $state();
    let newTaskEstimate: number | undefined = $state();
    let newTaskPriority = $state<undefined | 'low' | 'medium' | 'high'>(undefined);

   async function handleSubmit () {
        await invoke<Task[]>("create_task", {parentId: appState.newTaskInfo.parentId, parentProjectId: appState.newTaskInfo.parentProjectId, parentTaskId: appState.newTaskInfo.parentTaskId,  taskName: newTaskName,  estimatedHours: newTaskEstimate, priority: newTaskPriority });

       appState.triggerUpdateProjectsList += 1
       handleClose()
   }

    function handleClose () {
        appState.newTaskInfo.isNewTaskModalOpen = false;

        appState.newTaskInfo.parentId = undefined
        appState.newTaskInfo.parentProjectId = undefined
        appState.newTaskInfo.parentTaskId = undefined

        newTaskName = undefined;
        newTaskEstimate = undefined;
        newTaskPriority = undefined;

        appState.triggerTaskCardStateCheck += 1
        dialog.close();
    }

    $effect(() => {
        if (appState.newTaskInfo.isNewTaskModalOpen) dialog.showModal();
    });
</script>

<dialog
        class="modal-container"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">New Task</h2>
        </div>
        <div class="modal-content">
            <div class="form-group">
                <label for="taskname">Task Name</label>
                <input class="modal-input" id="taskname" type="text" placeholder="Project Name" bind:value={newTaskName}/>
            </div>
            <div class="form-group">
                <label for="taskest">Estimated Hours</label>
                <input class="modal-input" id="taskest" type="number" min="0" placeholder="Estimated Hours" bind:value={newTaskEstimate}/>
            </div>
            <div class="form-group">
                <label for="taskpriority">Priority</label>
                <div id="taskpriority" class="select">
                    <Chip text="Low" priority="low" active={newTaskPriority === 'low'} clickAction={() => newTaskPriority = 'low'}> </Chip>
                    <Chip text="Medium" priority="medium" active={newTaskPriority === 'medium'} clickAction={() => newTaskPriority = 'medium'}> </Chip>
                    <Chip text="High" priority="high" active={newTaskPriority === 'high'} clickAction={() => newTaskPriority = 'high'}> </Chip>
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <TextButton kind="bright" size="small" text="Create" clickAction={() => handleSubmit()}></TextButton>
            <TextButton kind="transparent" size="small" text="Cancel" clickAction={() => handleClose()}></TextButton>
        </div>
    </div>
</dialog>