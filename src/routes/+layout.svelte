<script lang="ts">
    import "../common/colors/color.css"
    import IconButton from "../common/components/IconButton/IconButton.svelte";
    import {goto,preloadData,} from "$app/navigation";
    import Icon from "../common/components/Icon/Icon.svelte";
    import type {Breadcrumb} from "../common/types/types.ts";
    import {appState} from "../state/appState.svelte";

    let { children } = $props();

    let isSidebarExtended = $state(false);

    function handleNavigate(name: string, path:string) {

        appState.breadCrumbPathArr = []

        let newBreadcrumb: Breadcrumb = {name: name, path:path}

        appState.breadCrumbPathArr.push(newBreadcrumb)

        goto(path)
    }
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
        height: 100dvh
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

    .app-child-container {
        border-left: 1px solid var(--border-subtle);
        width: 100%;
    }
</style>

<main class="app-container">
    <div class="app-content">
        <div class="nav-rail" class:extended={isSidebarExtended}>
            <div class="nav-rail-actions">
                <Icon kind="transparent" icon="stratum" size="medium" ></Icon>
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
                        hoverAction={() => preloadData("/")}
                        clickAction={() => handleNavigate("Home", "/")}/>
<!--                <IconButton-->
<!--                        kind="transparent"-->
<!--                        size="medium"-->
<!--                        icon="grid"-->
<!--                        label="Projects"-->
<!--                        showLabel={isSidebarExtended}-->
<!--                        hoverAction={() => preloadData("/projects")}-->
<!--                        clickAction={() => handleNavigate("Projects", "/projects")}/>-->
<!--                <IconButton-->
<!--                        kind="transparent"-->
<!--                        size="medium"-->
<!--                        icon="gantt"-->
<!--                        label="Gantt"-->
<!--                        showLabel={isSidebarExtended}-->
<!--                        hoverAction={() => preloadData("/gantt")}-->
<!--                        clickAction={() => handleNavigate("Gantt", "/gantt")}/>-->
<!--                <IconButton-->
<!--                        kind="transparent"-->
<!--                        size="medium"-->
<!--                        icon="sprint"-->
<!--                        label="Sprint"-->
<!--                        showLabel={isSidebarExtended}-->
<!--                        hoverAction={() => preloadData("/sprints")}-->
<!--                        clickAction={() => handleNavigate("Sprints", "/sprints")}/>-->
<!--                <IconButton-->
<!--                        kind="transparent"-->
<!--                        size="medium"-->
<!--                        icon="calendar"-->
<!--                        label="Calendar"-->
<!--                        showLabel={isSidebarExtended}-->
<!--                        hoverAction={() => preloadData("/calendar")}-->
<!--                        clickAction={() => handleNavigate("Calendar", "/calendar")}/>-->
            </div>
            <div class="nav-rail-footer">
                <IconButton
                        kind="transparent"
                        size="medium"
                        icon="settings"
                        label="Settings"
                        showLabel={isSidebarExtended}
                        clickAction={() => handleNavigate("Settings", "/settings")}/>
            </div>
        </div>
        <div class="app-child-container">
            {@render children()}
        </div>
    </div>
</main>