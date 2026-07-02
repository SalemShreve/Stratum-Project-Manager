<script lang="ts">
    import "./Pill.css"

    let {
        text,
        state,
        size
    } = $props<{
        text: string;
        state?: "low" | "medium" | "high" | "completed" | "incompleted" | "blocked"
        size?: "small"
    }>();
</script>

<div class="pill {state} {size}" >
    {text.charAt(0).toUpperCase() + text.slice(1)}
</div>