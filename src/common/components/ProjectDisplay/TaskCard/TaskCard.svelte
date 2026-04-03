<script lang="ts">
    import "./TaskCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import type {ColorEnum} from "../../../types/types";

    let {
        taskName,
        color,
    } = $props<{
        taskName: string;
        color: ColorEnum
    }>();

</script>

<div class="task-card">
    <div class="task-card-container">
        <div class="task-card-container-right" style="--project-color: var(--stratum-{color})">
            <IconButton kind="transparent" icon="chevronright" size="small"></IconButton>
            <span>{taskName}</span>
            <IconButton kind="transparent" icon="star" size="small"></IconButton>
        </div>
        <div class="task-card-container-left">
            <IconButton kind="transparent" size="small" icon="add" />
            <IconButton kind="transparent" size="small" icon="edit" />
            <IconButton kind="transparent" size="small" icon="trash" />
        </div>
    </div>
<!--    <div class="task-container">-->
<!--        -->
<!--    </div>-->
</div>