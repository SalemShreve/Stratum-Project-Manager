<script lang="ts">
    import "./ProjectCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import {type ColorEnum, mapTaskToProps, type Task} from "../../../types/types";
    import TaskCard from "../TaskCard/TaskCard.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";

    let {
        id,
        projectName,
        color,
        isFavorite,
        dateCreated,
        deadline,
        minutesWorked,
        priority,
        createdBy,
    } = $props<{
        id: string;
        projectName: string;
        color: ColorEnum;
        isFavorite: boolean;
        dateCreated: Date;
        deadline: Date;
        minutesWorked: number
        priority: "low" | "medium" | "high";
        createdBy?: string;
    }>();

    let areChildrenShown = $state(appState.allExpanded);
    let children = $state<Task[]>([]);

    let isFavoriteState = $state(isFavorite);

    async function loadProjectChildren() {
        children = await invoke<Task[]>("get_project_tasks", { parentId: id });
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

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    $effect(() => {
        loadProjectChildren();
    });

    $effect(() => {
        areChildrenShown = appState.allExpanded;
    });

</script>

<div class="project-card" class:starred={isFavorite}>
    <div class="project-card-container" class:children-hidden={!areChildrenShown}>
        <div class="project-card-container-left"
             style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenShown} clickAction={() => areChildrenShown = !areChildrenShown}></IconButton>
            <span class="project-card-name" title={projectName}>
                {projectName}
            </span>
            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => isFavoriteState = !isFavoriteState} ></IconButton>
            {#if children.length !== 0}
                <Pill text="{children.length} Tasks"></Pill>
            {/if}
        </div>
        <div class="project-card-container-middle">
            <div class="metadata-priority">
                <Pill text={priority} state={priority} kind="container"></Pill>
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
            <div class="metadata-createddate">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="2" y="4" width="20" height="18" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                    <line x1="7" y1="2" x2="7" y2="6"/>
                    <line x1="17" y1="2" x2="17" y2="6"/>
                </svg>
                created {formatDate(dateCreated)}
            </div>
            <div class="divider"></div>
            <div class="metadata-deadline">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                due {formatDate(deadline)}
            </div>
            {#if createdBy}
                <div class="divider"></div>
                <div class="metadata-createdby">{createdBy}</div>
            {/if}
        </div>
        <div class="project-card-container-right">
            <div class="divider"></div>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()} />
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>
    <div class="task-container" class:hidden={!areChildrenShown || children.length === 0} >
        {#each children as task}
            {@const props = mapTaskToProps(task, color)}
            <TaskCard {...props} isVisible={areChildrenShown} isParentLastInDepth={true} />
        {/each}
    </div>
</div>