<script lang="ts">
    import "./NewProjectModal.css"
    import TextButton from "../../TextButton/TextButton.svelte";
    import {COLOR_VALUES, type ColorEnum, type Task} from "../../../types/types";
    import Chip from "../../Chip/Chip.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let { isNewProjectModalOpen = $bindable()} = $props();
    let dialog: any = $state();


    let newProjectName: string | undefined = $state();
    let newProjectDeadline: Date | undefined = $state();
    let newProjectPriority = $state<undefined | 'low' | 'medium' | 'high'>(undefined);
    let newProjectColor: ColorEnum | undefined = $state();

   async function handleSubmit () {

       if (newProjectName == undefined || newProjectDeadline == undefined || newProjectPriority == undefined || newProjectColor == undefined) {}

       await invoke<Task[]>("create_project", { projectName: newProjectName, color: newProjectColor, deadline: newProjectDeadline, priority: newProjectPriority });

       appState.triggerUpdateProjectsList += 1
       handleClose()
   }

    function handleClose () {
        isNewProjectModalOpen = false;

        newProjectName = undefined;
        newProjectDeadline = undefined;
        newProjectPriority = undefined;
        newProjectColor = undefined;

        dialog.close();
    }

    $effect(() => {
        if (isNewProjectModalOpen) dialog.showModal();
    });
</script>

<dialog
        class="modal-container"
        bind:this={dialog}
        onclose={() => handleClose()}
>
    <div>
        <div class="modal-header">
            <h2 class="modal-title">New Project</h2>
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
        </div>
        <div class="modal-footer">
            <TextButton kind="bright" size="small" text="Create" clickAction={() => handleSubmit()}></TextButton>
            <TextButton kind="transparent" size="small" text="Close" clickAction={() => handleClose()}></TextButton>
        </div>
    </div>
</dialog>