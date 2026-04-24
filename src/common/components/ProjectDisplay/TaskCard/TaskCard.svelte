<script lang="ts">
    import "./TaskCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import TaskCard from "./TaskCard.svelte";
    import {type ColorEnum, mapTaskToProps, type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";
    import Pill from "../../Pill/Pill.svelte";

    let {
        id,
        parentProjectId,
        parentId,
        name,
        color,
        isFavorite,
        dateCreated,
        estimatedDays,
        active,
        lastStarted,
        minutesWorked,
        priority,
    } = $props<{
        id: string,
        parentProjectId: string,
        parentId: string,
        name: string,
        color: ColorEnum,
        isFavorite: number,
        dateCreated: Date,
        estimatedDays: number,
        active: boolean,
        lastStarted: string,
        minutesWorked: number,
        priority: "low" | "medium" | "high";
    }>();

    let areChildrenHidden = $state(appState.allExpanded);
    let isFavoriteState = $state(isFavorite);

    let children = $state<Task[]>([]);

    async function loadTaskChildren() {
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
        appState.newTaskInfo.parentProjectId = parentProjectId

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    $effect(() => {
        loadTaskChildren();
    });

    $effect(() => {
        areChildrenHidden = appState.allExpanded;
    });

</script>

<div class="task-card">
    <div class="task-card-container">
        <div class="task-card-container-left" style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenHidden} clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span class="task-card-name">
                {name}
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
        </div>
        <div class="task-card-container-right">
            {#if children.length === 0}
                <IconButton kind="transparent" size="small" icon="check" />
            {/if}
            <div class="divider"></div>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>
    {#if areChildrenHidden && children.length > 0}
        <div class="task-container">
            {#each children as task}
                {@const props = mapTaskToProps(task, color)}
                <TaskCard {...props} />
            {/each}
        </div>
    {/if}
</div>