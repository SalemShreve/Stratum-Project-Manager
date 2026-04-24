<script lang="ts">
    import "./Pill.css"
    import Tooltip from "../Tooltip/Tooltip.svelte";

    let {
        text,
        state,
        label,
        kind
    } = $props<{
        text: string;
        state?: "low" | "medium" | "high"
        label?: string;
        kind?: "content" | "container";
    }>();
</script>

<div class="pill {state} {kind}" >
    {text}
    {#if label}
        <span class="pill-tooltip">
            <Tooltip text={label}/>
        </span>
    {/if}
</div>