<script lang="ts">
    import "./Tasks.css"
    import { page } from '$app/state';
    import {invoke} from "@tauri-apps/api/core";
    import {
        type ITaskCard,
        type Project
    } from "../../../common/types/types";
    import {appState} from "../../../state/appState.svelte";
    import Pill from "../../../common/components/Pill/Pill.svelte";
    import TextButton from "../../../common/components/TextButton/TextButton.svelte";
    import NewTaskModal from "../../../common/components/Modal/NewTaskModal/NewTaskModal.svelte";
    import BreadCrumbPath from "../../../common/BreadCrumbPath/BreadCrumbPath.svelte";
    import TaskDisplayPanel from "../../../common/components/ProjectDisplayV2/TaskDisplayPanel/TaskDisplayPanel.svelte";
    import DeleteConfirmModal from "../../../common/components/Modal/DeleteConfirmModal/DeleteConfirmModal.svelte";
    import TaskRow from "../../../common/components/ProjectDisplayV2/TaskRow/TaskRow.svelte";
    import EditProjectModal from "../../../common/components/Modal/EditModal/EditProjectModal.svelte";
    import Chip from "../../../common/components/Chip/Chip.svelte";
    import IconButton from "../../../common/components/IconButton/IconButton.svelte";

    const id = $derived(page.params.parentId);
    let project = $state<Project>();
    let tasks = $state<ITaskCard[]>();

    let selectedTaskId = $state<string | undefined>();
    let allExtended = $state(false)

    let sort = $state<'none' | 'starred' | 'created' | 'deadline' | 'name'>('none');
    let activeFilter = $state(false)
    let lowFilter = $state(false)
    let mediumFilter = $state(false)
    let highFilter = $state(false)

    async function loadProjectData() {
        project = await invoke<Project>("get_project" , { projectId: id});
    }

    async function loadTaskData() {
        tasks = await invoke<ITaskCard[]>("get_tasks_v2" , { parentId: id});
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id
        appState.newTaskInfo.parentProjectId = id
        appState.newTaskInfo.parentTaskId = undefined

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    $effect(() => {
        appState.triggerUpdateProjectsList
        loadProjectData();
        loadTaskData()
    });

</script>

<main class="tasks-page">
    <DeleteConfirmModal></DeleteConfirmModal>
    <EditProjectModal></EditProjectModal>
    <NewTaskModal></NewTaskModal>
    <div class="tasks-topbar">
        <div class="projects-actionsbar">
            <div class="projects-actionsbar-left">
                <h1 style="font-family: var(--font-mono); margin: 0; color: var(--text-primary)">{project?.name}</h1>
                <Pill text="{project?.totaltasks} Tasks"></Pill>
            </div>
            <TextButton kind="bright" size="medium" text="+ New Task" clickAction={() => handleNewTaskBtnClicked()}> </TextButton>
        </div>
        <div class="projects-topbar-footer">
            <BreadCrumbPath></BreadCrumbPath>
        </div>
        <div class="home-filterbar">
            <div class="filter-right">
                <IconButton kind="transparent" size="small" icon="expandall" toggleIcon="collapseall" isToggled={allExtended} clickAction={() => allExtended = !allExtended}></IconButton>
                <div class="divider"></div>
                <span class="text-label">Sort</span>
                <Chip text="None" active={sort === 'none'} clickAction={() => sort = 'none'}> </Chip>
                <Chip text="★ Starred" starred active={sort === 'starred'} clickAction={() => sort = 'starred'}> </Chip>
                <Chip text="Name" active={sort === 'name'} clickAction={() => sort = 'name'}> </Chip>
                <Chip text="Date Created" active={sort === 'created'} clickAction={() => sort = 'created'}> </Chip>
                <Chip text="Deadline" active={sort === 'deadline'} clickAction={() => sort = 'deadline'}> </Chip>
                <div class="divider"></div>
                <span class="text-label">Filter</span>
                <Chip text="Active" active={activeFilter} clickAction={() => activeFilter = !activeFilter}> </Chip>
                <Chip text="Low" priority="low" active={lowFilter} clickAction={() => lowFilter = !lowFilter}> </Chip>
                <Chip text="Medium" priority="medium" active={mediumFilter} clickAction={() => mediumFilter = !mediumFilter}> </Chip>
                <Chip text="High" priority="high" active={highFilter} clickAction={() => highFilter = !highFilter}> </Chip>
            </div>
            <div class="filter-search">
                <input type="search">
            </div>
        </div>
    </div>
    <div class="tasks-container">
        <div class="task-list">
            <!--{#each tasks as task}-->
            <!--    <TaskCardV2 bind:selectedTaskId={selectedTaskId} {...task} />-->
            <!--{/each}-->
            {#each tasks as task}
                <TaskRow bind:selectedTaskId={selectedTaskId} bind:allExtended={allExtended} {...task} />
            {/each}
        </div>
        {#if selectedTaskId !== undefined }
            <TaskDisplayPanel taskid={selectedTaskId}></TaskDisplayPanel>
        {/if}
    </div>
</main>