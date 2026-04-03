<script lang="ts">
    import "./ProjectCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import type {ColorEnum} from "../../../types/types";
    import TaskCard from "../TaskCard/TaskCard.svelte";

    let areChildrenHidden = $state(false);

    let {
        projectName,
        color,
    } = $props<{
        projectName: string;
        color: ColorEnum;
    }>();

</script>

<div class="project-card">
    <div class="project-card-container" class:children-hidden={!areChildrenHidden}>
        <div class="project-card-container-right"
             style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" icon="chevronright" size="small" clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span>{projectName}</span>
            <IconButton kind="transparent" icon="star" size="small"></IconButton>
        </div>
        <div class="project-card-container-left">
            <IconButton kind="transparent" size="small" icon="add" />
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>

    {#if areChildrenHidden}
        <div class="task-container">
            <TaskCard taskName="First Task" color={color}></TaskCard>
            <TaskCard taskName="Second Task" color={color}></TaskCard>
        </div>
    {/if}
</div>