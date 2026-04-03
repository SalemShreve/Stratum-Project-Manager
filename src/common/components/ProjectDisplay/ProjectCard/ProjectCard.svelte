<script lang="ts">
    import "./ProjectCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import type {ColorEnum} from "../../../types/types";
    import TaskCard from "../TaskCard/TaskCard.svelte";

    let {
        id,
        projectName,
        color,
        isFavorite,
    } = $props<{
        id: number;
        projectName: string;
        color: ColorEnum;
        isFavorite: boolean;
    }>();

    let areChildrenHidden = $state(false);
    let isFavoriteState = $state(isFavorite);

</script>

<div class="project-card">
    <div class="project-card-container" class:children-hidden={!areChildrenHidden}>
        <div class="project-card-container-right"
             style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenHidden} clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span class="project-card-name" title={projectName} >{projectName}</span>
            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => isFavoriteState = !isFavoriteState} ></IconButton>
        </div>
        <div class="project-card-container-left">
            <IconButton kind="transparent" size="small" icon="add" />
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>

    {#if areChildrenHidden}
        <div class="task-container">
            <TaskCard id={11} isFavorite={true} taskName="First Task" color={color}></TaskCard>
            <TaskCard id={12} isFavorite={false} taskName="Second Task" color={color}></TaskCard>
        </div>
    {/if}
</div>