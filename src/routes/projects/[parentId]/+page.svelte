<script lang="ts">
    import "./Tasks.css"
    import { page } from '$app/state';
    import {invoke} from "@tauri-apps/api/core";
    import {
        type ITaskCard,
        type Project, type SortEnum
    } from "../../../common/types/types";
    import {appState, appStateV2} from "../../../state/appState.svelte";
    import Pill from "../../../common/components/Pill/Pill.svelte";
    import TextButton from "../../../common/components/TextButton/TextButton.svelte";
    import NewTaskModal from "../../../common/components/Modal/NewTaskModal/NewTaskModal.svelte";
    import BreadCrumbPath from "../../../common/components/BreadCrumbPath/BreadCrumbPath.svelte";
    import TaskDisplayPanel from "../../../common/components/ProjectDisplayV2/TaskDisplayPanel/TaskDisplayPanel.svelte";
    import DeleteConfirmModal from "../../../common/components/Modal/DeleteConfirmModal/DeleteConfirmModal.svelte";
    import TaskRow from "../../../common/components/ProjectDisplayV2/TaskRow/TaskRow.svelte";
    import Chip from "../../../common/components/Chip/Chip.svelte";
    import IconButton from "../../../common/components/IconButton/IconButton.svelte";
    import EditTaskModal from "../../../common/components/Modal/EditTaskModal/EditTaskModal.svelte";

    const id = $derived(page.params.parentId);
    let project = $state<Project>();
    let tasks = $state<ITaskCard[]>();
    let filteredTasks = $state<ITaskCard[]>();

    let selectedTaskId = $state<string | undefined>();
    let allExtended = $state(false)

    let sort = $state<SortEnum>(undefined);

    async function loadProjectData() {
        project = await invoke<Project>("get_project" , { projectId: id});
    }

    async function loadTaskData() {
        tasks = await invoke<ITaskCard[]>("get_tasks_v2" , { parentId: id});
        filteredTasks = tasks
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id
        appState.newTaskInfo.parentProjectId = id
        appState.newTaskInfo.parentTaskId = undefined

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function manageFilters(filter: string) {
        if (appStateV2.activeFilters.includes(filter)) {
            appStateV2.activeFilters = appStateV2.activeFilters.filter(activeFilter => activeFilter !== filter);
        } else if (!(appStateV2.activeFilters.includes(filter))) {
            appStateV2.activeFilters.push(filter);
        }

        if (appStateV2.activeFilters.length > 0) {
            filteredTasks = tasks?.filter(tasks => appStateV2.activeFilters.includes(tasks.priority));
        } else {
            filteredTasks = tasks
        }
    }

    function manageSort(sortType: SortEnum) {
        if (sort === sortType) {
            sort = undefined
            return
        }

        sort = sortType

        if (sort === "name") {
            filteredTasks = tasks?.sort((a, b) => a.name.localeCompare(b.name));
        }
        else if (sort === "created") {
            filteredTasks = tasks?.sort((a, b) => a.datecreated.getTime() - b.datecreated.getTime());
        }
    }

    $effect(() => {
        appState.triggerUpdateProjectsList
        loadProjectData();
        loadTaskData()
    });

</script>

<main class="tasks-page">
    <DeleteConfirmModal  bind:selectedTaskId={selectedTaskId} ></DeleteConfirmModal>
    <EditTaskModal></EditTaskModal>
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
        <div class="tasks-filterbar">
            <div class="filter-right">
                <IconButton kind="transparent" size="small" icon="expandall" toggleIcon="collapseall" isToggled={allExtended} clickAction={() => allExtended = !allExtended}></IconButton>
                <div class="divider"></div>
<!--                <span class="text-label">Sort</span>-->
<!--                <Chip text="Name" active={sort === 'name'} clickAction={() => manageSort('name')}> </Chip>-->
<!--                <Chip text="Created" active={sort === 'created'} clickAction={() => manageSort('created')}> </Chip>-->
<!--                <Chip text="Priority" active={sort === 'priority'} clickAction={() => manageSort('priority')}> </Chip>-->
<!--                <Chip text="Status" active={sort === 'state'} clickAction={() => manageSort('state')}> </Chip>-->
<!--                <div class="divider"></div>-->
                <span class="text-label">Filter</span>
                <Chip text="Active" active={appStateV2.activeFilters.includes("active")} clickAction={() => manageFilters("active")}> </Chip>
                <Chip text="Low" priority="low" active={appStateV2.activeFilters.includes("low")} clickAction={() => manageFilters("low")}> </Chip>
                <Chip text="Medium" priority="medium" active={appStateV2.activeFilters.includes("medium")} clickAction={() => manageFilters("medium")}> </Chip>
                <Chip text="High" priority="high" active={appStateV2.activeFilters.includes("high")} clickAction={() => manageFilters("high")}> </Chip>
            </div>
            <div class="filter-search">
                <input type="search">
            </div>
        </div>
    </div>
    {#if filteredTasks !== undefined && filteredTasks.length > 0}
        <div class="tasks-container">
            <div class="task-list">
                {#each filteredTasks as task}
                    <TaskRow bind:selectedTaskId={selectedTaskId} bind:allExtended={allExtended} {...task} />
                {/each}
            </div>
            {#if selectedTaskId !== undefined }
                <TaskDisplayPanel selectedTaskId={selectedTaskId} ></TaskDisplayPanel>
            {/if}
        </div>
        {:else}
        <div class="no-tasks">No Tasks</div>
    {/if}
</main>