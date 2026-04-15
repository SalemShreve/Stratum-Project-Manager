<script lang="ts">
    import "./TaskCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import TaskCard from "./TaskCard.svelte";
    import {type ColorEnum, mapTaskToProps, type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";

    let {
        id,
        parentprojectid,
        parenttaskid,
        name,
        color,
        favorite,
        datecreated,
        deadline,
        laststarted,
        minutesworked,
        priority,
    } = $props<{
        id: string,
        parentprojectid: string,
        parenttaskid: string,
        name: string,
        color: ColorEnum,
        favorite: number,
        datecreated: Date,
        deadline: Date,
        laststarted: string,
        minutesworked: number,
        priority: "low" | "medium" | "high";
    }>();

    let areChildrenHidden = $state(false);
    let isFavoriteState = $state(favorite);

    let tasks = $state<Task[]>([]);

    async function loadProjects() {
        tasks = await invoke<Task[]>("get_child_tasks", { parentProjectId: id });
    }

    $effect(() => {
        loadProjects();
    });

</script>

<div class="task-card">
    <div class="task-card-container">
        <div class="task-card-container-right" style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenHidden} clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span>{name}</span>
            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => isFavoriteState = !isFavoriteState} ></IconButton>
        </div>
        <div class="task-card-container-left">
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