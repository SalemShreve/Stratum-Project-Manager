<script lang="ts">
    import "./IconButton.css"
    import {getIcon, type IconEnum, type SizeEnum} from "../../types/types";

    let {
        clickAction,
        hoverAction,
        kind,
        icon,
        toggleIcon,
        size,
        isSelected,
        isToggled,
        isLoading,
        showLabel,
        hasBorder,
        title,
        label,
        testId,
    } = $props<{
        clickAction?: () => void;
        hoverAction?: () => void;
        kind: 'toggle' | 'transparent';
        icon: IconEnum;
        toggleIcon?: IconEnum;
        size: SizeEnum;
        isToggled?: boolean;
        isLoading?: boolean;
        isSelected?: boolean;
        showLabel?: boolean;
        hasBorder?: boolean;
        title?: string;
        label?: string;
        testId?: string;
    }>();

    let IconComponent = $state<any>(null);

    $effect(() => {
        if (isToggled) {
            getIcon(size, toggleIcon).then(c => IconComponent = c);
        }
        else {
            getIcon(size, icon).then(c => IconComponent = c);
        }
    });
</script>

<button
        class="icon-btn {kind} {size}"
        class:selected={isSelected}
        class:toggled={isToggled}
        class:labeled={showLabel}
        class:bordered={hasBorder}

        {title}
        onclick={() => clickAction?.()}
        onmouseenter={() => hoverAction?.()}

        disabled={isLoading}
        data-testid={testId}
>
    {#if isLoading}
        <div class="icon-btn-spinner"></div>
    {:else}
        <IconComponent/>
    {/if}

    {#if showLabel}
        <span class="icon-btn-label">{label}</span>
    {/if}
</button>