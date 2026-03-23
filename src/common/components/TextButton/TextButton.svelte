<script lang="ts">
    import "./TextButton.css"

    let {
        clickAction,
        kind,
        text,
        size,
        toggleVar,
        loadingVar,
        title,
        label,
        testId,
    } = $props<{
        clickAction?: () => {};
        kind: 'normal' | 'toggle' | 'destroy' | 'transparent';
        text: string;
        toggleVar?: boolean;
        loadingVar?: boolean;
        title?: string;
        label?: string;
        testId?: string;
    }>();

</script>

<button
        class="text-btn {kind} {toggleVar}"
        {title}
        onclick={clickAction}
        disabled={loadingVar}
        data-testid={testId}
>
    {text}
</button>