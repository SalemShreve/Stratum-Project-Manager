<script lang="ts">
    import "./Pill.css"
    import {getIcon, type IconEnum} from "../../types/types";
    import {capitalize} from "../../utils/utils";

    let {
        text,
        pillstate,
        size,
        icon,
    } = $props<{
        text: string;
        pillstate?: "low" | "medium" | "high" | "completed" | "incompleted" | "blocked" | "group" | "normal" | "bright"
        size?: "small"
        icon?: IconEnum;
    }>();

    let IconComponent = $state<any>(null);

    $effect(() => {
        getIcon('small', icon).then(c => IconComponent = c);
    });

</script>

<div class="pill {pillstate} {size}" >
    {#if IconComponent}
        <div>
            <IconComponent />
        </div>
    {/if}
    {capitalize(text)}
</div>