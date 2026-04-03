<script>
    import "../common/colors/color.css"
    import IconButton from "../common/components/IconButton/IconButton.svelte";
    import {goto} from "$app/navigation";
    import Icon from "../common/components/Icon/Icon.svelte";

    let { children } = $props();

    let isSidebarExtended = $state(false);
</script>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
    }
    :global(svg) {
        flex-shrink: 0;
    }
    :root {
        color: #f6f6f6;
        background-color: var(--bg-page);
        margin: 0;
    }
    .app-container {
        display: flex;
        flex-direction: column;
        margin: 0;
        overflow: hidden;
    }
    .app-content {
        display: flex;
        width: 100dvw;
        height: calc(100dvh - 50px);
    }
    .nav-rail {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: space-between;
        row-gap: 5px;
        padding: 5px 0 5px 5px;
        position: relative;
        height: calc(100% - 10px);
        width: 45px;
        min-width: 45px;
        margin-left: 0;
        transition: width 0.2s ease;
    }
    .nav-rail.extended {
        width: 200px;
        align-items: flex-start;
        padding: 5px;
    }

    .nav-rail-actions,
    .nav-rail-footer {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
        width: 100%;
        padding: 0;
        margin: 0;
    }

    .app-top-bar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        height: 50px;
        min-height: 50px;
        padding-right: 13px;
        width: calc(100% - 13px);
        /*border-bottom: 1px solid var(--border-subtle);*/
        margin: 0;
    }
    .app-bar-icon-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50px;
    }
    .app-child-container {
        border-left: 1px solid var(--border-subtle);
        border-top: 1px solid var(--border-subtle);
        border-top-left-radius: 8px;
        width: 100%;
        padding: 0 0 10px 10px;
    }
    .app-bar-search {
        border: 6px;
        min-height: 27px;
        min-width: 100px;
    }
</style>

<main class="app-container">
    <div class="app-top-bar">
        <div class="app-bar-icon-container">
            <Icon kind="transparent" icon="stratum" size="medium" ></Icon>
        </div>
        <div class="app-bar-middle">
<!--            <input class="app-bar-search" type="text">-->
        </div>
        <div class="app-bar-actions">
        </div>
    </div>
    <div class="app-content">
        <div class="nav-rail" class:extended={isSidebarExtended}>
            <div class="nav-rail-actions">
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="sidebar"
                        label="Sidebar"
                        showLabel={isSidebarExtended}
                        clickAction={() => isSidebarExtended=!isSidebarExtended }/>
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="home"
                        label="Home"
                        showLabel={isSidebarExtended}
                        clickAction={() => goto("/")}/>
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="gantt"
                        label="Gantt"
                        showLabel={isSidebarExtended}
                        clickAction={() => goto("/gantt")}/>
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="sprint"
                        label="Sprint"
                        showLabel={isSidebarExtended}
                        clickAction={() => goto("/sprints")}/>
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="calendar"
                        label="Calendar"
                        showLabel={isSidebarExtended}
                        clickAction={() => goto("/calendar")}/>
            </div>
            <div class="nav-rail-footer">
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="settings"
                        label="Settings"
                        showLabel={isSidebarExtended}
                        clickAction={() => goto("/settings")}/>
            </div>
        </div>
        <div class="app-child-container">
            {@render children()}
        </div>
    </div>
</main>