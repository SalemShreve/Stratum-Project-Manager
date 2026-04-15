<script lang="ts">
    import "./Chip.css"

    let {
        text,
        clickAction,
        active = false,
        disabled = false,
        starred = false,
        priority,
    } = $props<{
        text: string;
        clickAction?: () => void;
        active?: boolean;
        disabled?: boolean;
        starred?: boolean;
        priority?: "low" | "medium" | "high";
    }>();
</script>

<button
        class="chip {priority}"
        class:active
        class:disabled
        class:starred
        onclick={() => clickAction?.()}
        {disabled}
>
    {text}
</button>