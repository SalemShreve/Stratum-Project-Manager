<script lang="ts">
    import "./ProjectCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import {mapTaskToProps, type ProjectCard, type Task} from "../../../types/types";
    import TaskCard from "../TaskCard/TaskCard.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let {
        id,
        name,
        color,
        favorite,
        dateCreated,
        deadline,
        minutesWorked,
        priority,
        totaltasks,
        completedtasks,
        createdBy,
    }: ProjectCard = $props();

    let areChildrenShown = $state(appState.allExpanded);
    let children = $state<Task[]>([]);

    let isFavoriteState = $state(favorite);

    async function loadProjectChildren() {
        children = await invoke<Task[]>("get_tasks", { parentId: id, nodeType: 0 });
    }

    async function handleFavoriteToggle() {
        isFavoriteState = !isFavoriteState

        console.log(isFavoriteState)

        await invoke<Task[]>("set_favorite", { projectId: id, favoriteState: isFavoriteState });
    }

    function handleEditBtnClicked() {
        appState.editNodeInfo.nodeId = id
        appState.editNodeInfo.nodeType = "project";
        appState.editNodeInfo.isEditModalOpen = true;
    }

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }


    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id
        appState.newTaskInfo.parentProjectId = id
        appState.newTaskInfo.parentTaskId = undefined

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = id
        appState.deleteNodeInfo.nodeName = name
        appState.deleteNodeInfo.nodeType = "project"

        appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
    }

    $effect(() => {
        loadProjectChildren();
    });

    $effect(() => {
        areChildrenShown = appState.allExpanded;
    });

</script>

<div class="project-card" class:starred={favorite}>
    <div class="project-card-container" class:children-hidden={!areChildrenShown}>
        <div class="project-card-container-left"
             style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenShown} clickAction={() => areChildrenShown = !areChildrenShown}></IconButton>
            <span class="project-card-name" title={name}>
                {name}
            </span>
            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => handleFavoriteToggle()} ></IconButton>
            {#if children.length !== 0}
                <Pill text="{children.length} Tasks"></Pill>
            {/if}
        </div>
        <div class="project-card-container-middle">
            <div class="metadata-priority">
                <Pill text={priority} state={priority}></Pill>
            </div>
            <div class="divider"></div>
            <div class="metadata-timeworked">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                </svg>
                {(minutesWorked / 60).toFixed(2)} hr
            </div>
            <div class="divider"></div>
            <div class="metadata-createddate" title="Date Created">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="2" y="4" width="20" height="18" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                    <line x1="7" y1="2" x2="7" y2="6"/>
                    <line x1="17" y1="2" x2="17" y2="6"/>
                </svg>
                {formatDate(dateCreated)}
            </div>
            <div class="divider"></div>
            <div class="metadata-deadline" title="Deadline">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {formatDate(deadline)}
            </div>
            {#if createdBy}
                <div class="divider"></div>
                <div class="metadata-createdby">{createdBy}</div>
            {/if}
        </div>
        <div class="project-card-container-right">
            <div class="divider"></div>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()} />
            <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
        </div>
    </div>
    <div class="task-container" class:hidden={!areChildrenShown || children.length === 0} >
        {#each children as task}
            {@const props = mapTaskToProps(task)}
            <TaskCard {...props} isVisible={areChildrenShown} isParentLastInDepth={true} />
        {/each}
    </div>
</div>