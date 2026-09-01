<script lang="ts">
    import "./DeleteConfirmModal.css"
    import TextButton from "../../TextButton/TextButton.svelte";
    import {type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let {
        selectedTaskId = $bindable(),
    } = $props<{
        selectedTaskId: string | undefined;
    }>();

    let dialog: any = $state();

    async function handleSubmit () {
        if (appState.deleteNodeInfo.nodeType === "project") {
            await invoke<Task[]>("delete_project", {projectId: appState.deleteNodeInfo.nodeId });
        }
        else if (appState.deleteNodeInfo.nodeType === "task") {

            if (selectedTaskId !== undefined && selectedTaskId === appState.deleteNodeInfo.nodeId) {
                selectedTaskId = undefined;
            }

            await invoke<Task[]>("delete_task", {taskId: appState.deleteNodeInfo.nodeId });
        }

        appState.triggerUpdateProjectsList += 1
        handleClose()
    }

    function handleClose () {
        appState.deleteNodeInfo.isDeleteConfirmModalOpen = false;

        appState.deleteNodeInfo.nodeId = undefined
        appState.deleteNodeInfo.nodeName = undefined
        appState.deleteNodeInfo.nodeType = undefined


        dialog.close();
    }

    $effect(() => {
        if (appState.deleteNodeInfo.isDeleteConfirmModalOpen) dialog.showModal();
    });
</script>

<dialog
        class="modal-container delete"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">Confirm Deletion</h2>
        </div>
        <div class="modal-content">
            Deleting {appState.deleteNodeInfo.nodeName} will also delete all child tasks permanently. Do you want to continue?
        </div>
        <div class="modal-footer">
            <TextButton kind="bright" size="small" text="Delete" clickAction={() => handleSubmit()}></TextButton>
            <TextButton kind="transparent" size="small" text="Cancel" clickAction={() => handleClose()}></TextButton>
        </div>
    </div>
</dialog>