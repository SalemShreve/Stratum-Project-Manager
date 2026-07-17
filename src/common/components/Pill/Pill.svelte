<script lang="ts">
    import "./Pill.css"

    let {
        text,
        state,
        size,
        hover
    } = $props<{
        text: string;
        state?: "low" | "medium" | "high" | "completed" | "incompleted" | "blocked" | "group" | "normal" | "bright"
        size?: "small"
        hover?: boolean
    }>();
</script>

<div class="pill {state} {size}" >
    {text.charAt(0).toUpperCase() + text.slice(1)}
</div>