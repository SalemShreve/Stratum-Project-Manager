<script lang="ts">
    import "./Project.css"
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
    import TaskCardV2 from "../../../common/components/ProjectDisplayV2/TaskCardV2/TaskCardV2.svelte";

    const id = $derived(page.params.projectId);
    let project = $state<Project>();
    let tasks = $state<ITaskCard[]>();

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
    <NewTaskModal></NewTaskModal>
    <div class="projects-topbar">
        <div class="projects-actionsbar">
            <div class="projects-actionsbar-left">
                <h1 style="font-family: var(--font-mono); margin: 0; color: var(--text-primary)">{project?.name}</h1>
                <Pill text="{tasks?.length} Tasks"></Pill>
            </div>
            <TextButton kind="bright" size="medium" text="+ New Task" clickAction={() => handleNewTaskBtnClicked()}> </TextButton>
        </div>
        <div class="projects-topbar-footer">
            <BreadCrumbPath></BreadCrumbPath>
        </div>
    </div>
    <div class="tasks-container">
        {#each tasks as task}
            <TaskCardV2 {...task} />
        {/each}
    </div>
</main>