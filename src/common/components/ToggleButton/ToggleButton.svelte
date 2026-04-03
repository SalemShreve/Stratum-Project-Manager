<script lang="ts">
    import "./ToggleButton.css"

    let {
        clickAction,
        isToggled,
        title,
    } = $props<{
        clickAction?: () => void;
        isToggled: boolean;
        title?: string
    }>();

</script>

<div class="toggle-btn" class:on={isToggled} onclick={() => clickAction?.()} {title} />