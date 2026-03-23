<script lang="ts">
    import "./Icon.css"
    import SearchIcon16 from "../../icons/SearchIcon/SearchIcon16.svelte";
    import SearchIcon24 from "../../icons/SearchIcon/SearchIcon24.svelte";
    import SearchIcon32 from "../../icons/SearchIcon/SearchIcon32.svelte";
    import HomeIcon16 from "../../icons/HomeIcon/HomeIcon16.svelte";
    import HomeIcon24 from "../../icons/HomeIcon/HomeIcon24.svelte";
    import HomeIcon32 from "../../icons/HomeIcon/HomeIcon32.svelte";
    import EditIcon16 from "../../icons/EditIcon/EditIcon16.svelte";
    import EditIcon24 from "../../icons/EditIcon/EditIcon24.svelte";
    import EditIcon32 from "../../icons/EditIcon/EditIcon32.svelte";
    import SidebarIcon16 from "../../icons/SidebarIcon/SidebarIcon16.svelte";
    import SidebarIcon24 from "../../icons/SidebarIcon/SidebarIcon24.svelte";
    import SidebarIcon32 from "../../icons/SidebarIcon/SidebarIcon32.svelte";
    import StratumIcon16 from "../../icons/StratumIcon/StratumIcon16.svelte";
    import StratumIcon24 from "../../icons/StratumIcon/StratumIcon24.svelte";
    import StratumIcon32 from "../../icons/StratumIcon/StratumIcon32.svelte";
    import type {IconEnum} from "../../types/types";
    import SprintIcon16 from "../../icons/SprintIcon/SprintIcon16.svelte";
    import SprintIcon24 from "../../icons/SprintIcon/SprintIcon24.svelte";
    import SprintIcon32 from "../../icons/SprintIcon/SprintIcon32.svelte";

    let {
        kind,
        icon,
        size,
        title,
        testId

    } = $props<{
        kind: 'normal' | 'toggle' | 'destroy' | 'transparent';
        icon: IconEnum;
        size: "16" | "24" | "32";
        title?: string;
        testId?: string;
    }>();

    function sized(s16: any, s24: any, s32: any) {
        return size === "16" ? s16 : size === "32" ? s32 : s24;
    }

    const iconMap: Record<string, any> = {
        search: sized(SearchIcon16, SearchIcon24, SearchIcon32),
        home: sized(HomeIcon16, HomeIcon24, HomeIcon32),
        edit: sized(EditIcon16, EditIcon24, EditIcon32),
        sprint: sized(SprintIcon16, SprintIcon24, SprintIcon32),
        sidebar: sized(SidebarIcon16, SidebarIcon24,  SidebarIcon32),
        stratum:sized(StratumIcon16, StratumIcon24,  StratumIcon32),
    };
</script>

<div
        class="custom-icon {kind}"
        {title}
        data-testid={testId}
>
    {#if true}
        {@const IconComponent = iconMap[icon]}
        <IconComponent />
    {/if}
</div>

