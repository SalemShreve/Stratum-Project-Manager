<script lang="ts">
    import "./Projects.css"
    import {invoke} from "@tauri-apps/api/core";
    import NewProjectModal from "../common/components/Modal/NewProjectModal/NewProjectModal.svelte";
    import {appState} from "../state/appState.svelte";
    import type {IProjectCard} from "../common/types/types";
    import DeleteConfirmModal from "../common/components/Modal/DeleteConfirmModal/DeleteConfirmModal.svelte";
    import EditProjectModal from "../common/components/Modal/EditProjectModal/EditProjectModal.svelte";
    import NewTaskModal from "../common/components/Modal/NewTaskModal/NewTaskModal.svelte";
    import Pill from "../common/components/Pill/Pill.svelte";
    import TextButton from "../common/components/TextButton/TextButton.svelte";
    import BreadCrumbPath from "../common/components/BreadCrumbPath/BreadCrumbPath.svelte";
    import ProjectCardV2 from "../common/components/ProjectDisplayV2/ProjectCardV2/ProjectCardV2.svelte";


    let isNewProjectModalOpen = $state(false);

    let projects = $state<IProjectCard[]>();

    async function loadProjects() {
        projects = await invoke<IProjectCard[]>("get_projects_v2");
        console.log(projects);
    }

    $effect(() => {
        appState.triggerUpdateProjectsList
        loadProjects();
    });

</script>

<main class="projects-page">
    <NewProjectModal bind:isNewProjectModalOpen ></NewProjectModal>
    <DeleteConfirmModal></DeleteConfirmModal>
    <EditProjectModal></EditProjectModal>
    <NewTaskModal></NewTaskModal>
    <div class="projects-topbar">
        <div class="projects-actionsbar">
            <div class="projects-actionsbar-left">
                <h1 style="font-family: var(--font-mono); margin: 0; color: var(--text-primary)">Projects</h1>
                <Pill text="{projects?.length} Projects"></Pill>
            </div>
            <TextButton kind="bright" size="medium" text="+ New Project" clickAction={() => isNewProjectModalOpen = true}> </TextButton>
        </div>
        <BreadCrumbPath></BreadCrumbPath>
    </div>
    {#if projects !== undefined && projects.length > 0}
        <div class="projects-container">
            {#each projects as project}
                <ProjectCardV2 {...project} />
            {/each}
        </div>
    {:else}
        <div class="no-tasks">No Projects</div>
    {/if}
</main>