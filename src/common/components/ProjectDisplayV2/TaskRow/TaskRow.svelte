<script lang="ts">
    import "./TaskRow.css"
    import TaskRow from "./TaskRow.svelte";
    import {type ITaskCard} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState, appStateV2} from "../../../../state/appState.svelte";
    import IconButton from "../../IconButton/IconButton.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {untrack} from "svelte";
    import {capitalize} from "../../../utils/utils";

    let {
        id,
        parentprojectid,
        name,
        color,
        active,
        priority,
        status,
        totaltasks,
        completedtasks,
        selectedTaskId = $bindable(),
        allExtended = $bindable()
    }: ITaskCard & { selectedTaskId?: string, allExtended: boolean } = $props();

    let areChildrenShown = $state(false);

    let children = $state<ITaskCard[]>();
    let filteredChildren = $derived(
        appStateV2.activeFilters.length > 0
            ? children?.filter(c => appStateV2.activeFilters.includes(c.priority))
            : children
    );

    async function getTaskChildren() {
        children = await invoke<ITaskCard[]>("get_tasks_v2" , { parentId: id});
        filteredChildren = children;
    }

    async function updateTaskInfo() {
        let updatedTask = await invoke<ITaskCard>("get_task" , { taskId: id})

        status = updatedTask.status
        priority = updatedTask.priority
        name = updatedTask.name
    }

    function handleTaskExtended() {
        areChildrenShown = !areChildrenShown

        if (areChildrenShown) {
            getTaskChildren();
        }
    }

    function handleTaskSelected() {
        if (selectedTaskId === id) {
            selectedTaskId = undefined;
        }
        else selectedTaskId = id
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id;
        appState.newTaskInfo.parentProjectId = parentprojectid;
        appState.newTaskInfo.parentTaskId = id;

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleEditBtnClicked() {
        appState.editTaskInfo.taskId = id
        appState.editTaskInfo.isEditTaskModalOpen = true;
    }

    async function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = id
        appState.deleteNodeInfo.nodeName = name
        appState.deleteNodeInfo.nodeType = "task";

        appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
    }

    $effect(() => {
        getTaskChildren();
        areChildrenShown = allExtended
    });

    $effect(() => {
        appStateV2.updateTask
        untrack(() => {
            updateTaskInfo();
        });
    });

</script>

<div class="task-row-container">
    <div class="task-row"
         style="--project-color: var(--stratum-{color})"
         class:selected={selectedTaskId === id}
         role="none"
         onclick={() => handleTaskSelected()}>
        <div class="task-row-left">
            <div role="none" onclick={(e) => e.stopPropagation()}>
                {#if totaltasks > 0}
                    <IconButton icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenShown} kind="transparent" size="small" clickAction={() => handleTaskExtended()}></IconButton>
                {/if}
            </div>
            <div class="task-info">
                <div class="task-name {status}">{capitalize(name)}</div>
                <div class="task-metadata">
                    <Pill text={capitalize(priority)} pillstate={selectedTaskId === id ? priority : "normal"}></Pill>
                    <Pill text={capitalize(status)} pillstate={selectedTaskId === id ? status : "normal"}></Pill>
                    {#if totaltasks > 0 }
                        <Pill text={totaltasks + " Subtasks"} pillstate={selectedTaskId === id ? "bright" : "normal"}></Pill>
                    {/if}
                </div>
            </div>
        </div>
        <div class="task-row-right" role="none" onclick={(e) => e.stopPropagation()}>
            <div class="task-row-divider"></div>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
        </div>
    </div>
    {#if areChildrenShown && children !== undefined && children?.length > 0}
        <div class="task-row-list" class:hidden={!areChildrenShown || children?.length === 0} >
            {#each filteredChildren as task}
                <TaskRow bind:selectedTaskId={selectedTaskId} bind:allExtended={allExtended} {...task}  />
            {/each}
        </div>
    {/if}
</div>