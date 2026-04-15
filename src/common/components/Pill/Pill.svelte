<script lang="ts">
    import "./Pill.css"
    import Tooltip from "../Tooltip/Tooltip.svelte";

    let {
        text,
        state,
        label
    } = $props<{
        text: string;
        state?: "low" | "medium" | "high"
        label?: string;
    }>();
</script>

<div class="pill {state}" >
    {text}
    {#if label}
        <span class="pill-tooltip">
            <Tooltip text={label}/>
        </span>
    {/if}
</div>