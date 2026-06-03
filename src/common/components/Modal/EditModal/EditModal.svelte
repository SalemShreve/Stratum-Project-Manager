<script lang="ts">
    import TextButton from "../../TextButton/TextButton.svelte";
    import {type Project, type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let dialog: any = $state();

    let targetNode: Project | Task

    async function handleSubmit () {
        switch (appState.editNodeInfo.nodeType) {
            case "task":
                await invoke<Task>("update_task", {Id: appState.editNodeInfo.nodeId });
                break;
            case "project":
                await invoke<Project>("update_project", {projectId: appState.editNodeInfo.nodeId });
                break
            // case "folder":
            //     await invoke<Folder>("update_folder", {projectId: appState.editNodeInfo.nodeId });
            //     break;
        }

        handleClose()
    }

    async function getNode () {
        switch (appState.editNodeInfo.nodeType) {
            case "task":
                targetNode = await invoke<Task>("get_task", {taskId: appState.editNodeInfo.nodeId });
                console.log(targetNode);
                break;
            case "project":
                targetNode = await invoke<Project>("get_project", {projectId: appState.editNodeInfo.nodeId });
                console.log(targetNode);
                break
            // case "folder":
            //     targetNode = await invoke<Folder>("get_folder", {projectId: appState.editNodeInfo.nodeId });
            //     break;
        }
    }

    function handleClose () {
        appState.editNodeInfo.isEditModalOpen = false;

        appState.editNodeInfo.nodeId = undefined
        appState.editNodeInfo.nodeType = undefined;


        dialog.close();
    }

    $effect(() => {
        if (appState.editNodeInfo.isEditModalOpen) dialog.showModal();
    });
</script>

<dialog
        class="modal-container delete"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">Edit {appState.editNodeInfo.nodeType
                ? appState.editNodeInfo.nodeType.charAt(0).toUpperCase() + appState.editNodeInfo.nodeType.slice(1)
                : ''}</h2>
        </div>
        <div class="modal-content">
            Deleting {"Name"} will also delete all child tasks permanently. Do you want to continue?
        </div>
        <div class="modal-footer">
            <TextButton kind="bright" size="small" text="Delete" clickAction={() => handleSubmit()}></TextButton>
            <TextButton kind="transparent" size="small" text="Cancel" clickAction={() => handleClose()}></TextButton>
        </div>
    </div>
</dialog>