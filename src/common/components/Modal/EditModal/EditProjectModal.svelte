<script lang="ts">
    import "./EditProjectModal.css"
    import TextButton from "../../TextButton/TextButton.svelte";
    import {COLOR_VALUES, type ColorEnum, type Project} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";
    import Chip from "../../Chip/Chip.svelte";

    let dialog: any = $state();

    let newProjectName: string | undefined = $state();
    let newProjectDeadline: string | undefined = $state();
    let newProjectPriority = $state<undefined | 'low' | 'medium' | 'high'>(undefined);
    let newProjectColor: ColorEnum | undefined = $state();

    let targetProject: Project
    let errorMessage: string | undefined = $state();

    async function handleSubmit () {

        console.log("Submit Called")

        await invoke<Project>("update_project", {projectId: appState.editNodeInfo.nodeId, newName: newProjectName, newColor: newProjectColor, newDeadline: newProjectDeadline, newPriority: newProjectPriority });

        handleClose()
    }

    async function getProject () {
        targetProject = await invoke<Project>("get_project", {projectId: appState.editNodeInfo.nodeId });
        console.log(targetProject);


        newProjectName = targetProject.name;
        newProjectDeadline = targetProject.deadline;
        newProjectPriority = targetProject.priority;
        newProjectColor = targetProject.color as ColorEnum;
    }

    function checkUpdateBtnDisabled () {
        return newProjectName == targetProject?.name && newProjectDeadline == targetProject?.deadline && newProjectPriority == targetProject?.priority && newProjectColor == targetProject?.color as ColorEnum;
    }

    function handleClose () {
        appState.editNodeInfo.isEditModalOpen = false;

        appState.editNodeInfo.nodeId = undefined
        appState.editNodeInfo.nodeType = undefined;

        newProjectName = undefined;
        newProjectDeadline = undefined;
        newProjectPriority = undefined;
        newProjectColor = undefined;

        errorMessage = undefined;

        appState.triggerUpdateProjectsList += 1
        dialog.close();
    }

    $effect(() => {
        getProject()
        if (appState.editNodeInfo.isEditModalOpen && appState.editNodeInfo.nodeType == "project") dialog.showModal();
    });
</script>

<dialog
        class="modal-container"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">Update Project</h2>
        </div>
        <div class="modal-content">
            <div class="form-group">
                <label for="projectname">Project Name</label>
                <input class="modal-input" id="projectname" type="text" placeholder="Project Name" bind:value={newProjectName}/>
            </div>
            <div class="form-group">
                <label for="projectdeadline">Deadline</label>
                <input class="modal-input" id="projectdeadline" type="date" placeholder="Deadline" bind:value={newProjectDeadline}/>
            </div>
            <div class="form-group">
                <label for="projectpriority">Priority</label>
                <div class="select">
                    <Chip text="Low" priority="low" active={newProjectPriority === 'low'} clickAction={() => newProjectPriority = 'low'}> </Chip>
                    <Chip text="Medium" priority="medium" active={newProjectPriority === 'medium'} clickAction={() => newProjectPriority = 'medium'}> </Chip>
                    <Chip text="High" priority="high" active={newProjectPriority === 'high'} clickAction={() => newProjectPriority = 'high'}> </Chip>
                </div>
            </div>
            <div class="form-group">
                <label for="projectcolor">Color</label>
                <div id="projectcolor" class="swatch-select" >
                    {#each COLOR_VALUES as color}
                        <button
                                class="swatch"
                                class:selected={newProjectColor === color}
                                aria-label="color swatch"
                                style="background: var(--stratum-{color}"
                                onclick={() => newProjectColor = color}
                        ></button>
                    {/each}
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