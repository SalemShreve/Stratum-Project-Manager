<script lang="ts">
    import "./ProjectCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import {type ColorEnum, mapTaskToProps, type Task} from "../../../types/types";
    import TaskCard from "../TaskCard/TaskCard.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import Tooltip from "../../Tooltip/Tooltip.svelte";
    import {invoke} from "@tauri-apps/api/core";

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

    let areChildrenHidden = $state(false);
    let isFavoriteState = $state(isFavorite);

    let tasks = $state<Task[]>([]);

    async function loadProjects() {
        tasks = await invoke<Task[]>("get_project_tasks", { parentProjectId: id });
    }

    $effect(() => {
        loadProjects();
    });

</script>

<div class="project-card" class:starred={isFavorite}>
    <div class="project-card-container" class:children-hidden={!areChildrenHidden}>
        <div class="project-card-container-right"
             style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenHidden} clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span class="project-card-name">
                {projectName}
                <span class="project-title-tooltip">
                    <Tooltip text={projectName}/>
                </span>
            </span>
            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => isFavoriteState = !isFavoriteState} ></IconButton>
            <Pill text={priority} label="Priority" state={priority}></Pill>
        </div>
        <div class="project-card-container-left">
            <div class="actions-divider"></div>
            <IconButton kind="transparent" size="small" icon="add" />
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>

    {#if areChildrenHidden}
        <div class="task-container">
            {#each tasks as task}
                {@const props = mapTaskToProps(task, color)}
                <TaskCard {...props} />
            {/each}
        </div>
    {/if}
</div>