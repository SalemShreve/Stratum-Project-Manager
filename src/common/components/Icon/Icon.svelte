<script lang="ts">
    import "./Icon.css"
    import {getIcon, type IconEnum, type SizeEnum} from "../../types/types";

    let {
        kind,
        icon,
        size,
        title,
        testId
    } = $props<{
        kind: 'normal' | 'toggle' | 'destroy' | 'transparent';
        icon: IconEnum;
        size: SizeEnum;
        title?: string;
        testId?: string;
    }>();

    let IconComponent = $state<any>(null);

    $effect(() => {
        getIcon(size, icon).then(c => IconComponent = c);
    });

</script>

<div
        class="custom-icon {kind} {size}"
        {title}
        data-testid={testId}
>
    {#if IconComponent}
        <IconComponent />
    {/if}
</div>

