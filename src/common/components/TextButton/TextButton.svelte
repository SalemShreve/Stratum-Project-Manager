<script lang="ts">
    import "./TextButton.css"

    let {
        clickAction,
        kind,
        text,
        size,
        isToggled,
        isLoading,
        title,
        testId,
    } = $props<{
        clickAction?: () => {} | void;
        kind: 'bright'  | 'transparent';
        size: 'small' | 'medium' | 'inline'
        text: string;
        isToggled?: boolean;
        isLoading?: boolean;
        title?: string;
        testId?: string;
    }>();

</script>

<button
        class="text-btn {kind} {size}"
        class:toggled={isToggled}

        {title}
        onclick={() => clickAction?.()}
        disabled={isLoading}
        data-testid={testId}
>
    {text}
</button>