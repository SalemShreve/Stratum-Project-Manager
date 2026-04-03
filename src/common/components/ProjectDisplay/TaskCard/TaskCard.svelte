<script lang="ts">
    import "./TaskCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import type {ColorEnum} from "../../../types/types";

    let {
        id,
        taskName,
        color,
        isFavorite,
    } = $props<{
        id: number;
        taskName: string;
        color: ColorEnum
        isFavorite: boolean;
    }>();

    let areChildrenHidden = $state(false);
    let isFavoriteState = $state(isFavorite);

</script>

<div class="task-card">
    <div class="task-card-container">
        <div class="task-card-container-right" style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenHidden} clickAction={() => areChildrenHidden = !areChildrenHidden}></IconButton>
            <span>{taskName}</span>
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
        </div>
    {/if}
</div>