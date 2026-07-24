<script lang="ts">
    import "./BreadCrumbPath.css"
    import {goto} from "$app/navigation";
    import {appState} from "../../../state/appState.svelte.js";
    import type {Breadcrumb} from "../../types/types";

    function handlePathBtnClicked( path: Breadcrumb ) {
        goto(path.path)

        console.log(appState.breadCrumbPathArr.length)
        console.log(appState.breadCrumbPathArr.indexOf(path)+1)

        if (appState.breadCrumbPathArr.length > appState.breadCrumbPathArr.indexOf(path)+1) {
            appState.breadCrumbPathArr = appState.breadCrumbPathArr.slice(0, appState.breadCrumbPathArr.indexOf(path)+1)
        }
    }

</script>

<div class="breadcrumb-container">
    {#each appState.breadCrumbPathArr as path}
        {#if appState.breadCrumbPathArr.indexOf(path) > 0}
            <span class="breadcrumb-separator">/</span>
        {/if}
        <button class="breadcrumb-link" onclick={() => handlePathBtnClicked(path)}>{path.name}</button>
    {/each}
</div>

