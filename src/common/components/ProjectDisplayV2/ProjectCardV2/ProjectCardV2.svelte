<script lang="ts">
    import "./ProjectCardV2.css"
    import type {Task, Breadcrumb, IProjectCard} from "../../../types/types";
    import Pill from "../../Pill/Pill.svelte";
    import IconButton from "../../IconButton/IconButton.svelte";
    import {appState} from "../../../../state/appState.svelte";
    import {goto} from "$app/navigation";
    import {invoke} from "@tauri-apps/api/core";
    import {capitalize} from "../../../utils/utils";

    let {
        id,
        name,
        color,
        favorite,
        datecreated,
        deadline,
        priority,
        totaltasks,
        completedtasks,
    }: IProjectCard = $props();

    let isFavoriteState = $state(favorite);

    function formatDate(date: string): string {
        let realDate = new Date(date)
        return realDate.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
        });
    }

    function getCompletionPercent() {
        if (totaltasks > 0) {
            return Math.round((completedtasks / totaltasks) * 100).toString() + "%";
        } else return "0%";
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id;
        appState.newTaskInfo.parentProjectId = id;
        appState.newTaskInfo.parentTaskId = undefined;

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleEditBtnClicked() {
        appState.editNodeInfo.nodeId = id
        appState.editNodeInfo.nodeType = "project";
        appState.editNodeInfo.isEditModalOpen = true;
    }

    function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = id
        appState.deleteNodeInfo.nodeName = name
        appState.deleteNodeInfo.nodeType = "project"

        appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
    }

    function handleNavigate() {
        let newBreadcrumb: Breadcrumb = {name: name, path:`/projects/${id}`}

        appState.breadCrumbPathArr.push(newBreadcrumb)

        console.log(appState.breadCrumbPathArr)
        console.log("LOG")

        goto(`/projects/${id}`)
    }

    async function handleFavoriteToggle() {
        isFavoriteState = !isFavoriteState

        console.log(isFavoriteState)

        await invoke<Task[]>("set_favorite", { projectId: id, favoriteState: isFavoriteState });
    }

</script>

<div class="projectv2-card {totaltasks > 0 ? 'haschildren' : undefined}"
     role="button"
     tabindex="0"
     onclick={totaltasks > 0 ? () => handleNavigate() : () => console.log("none")}
     onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          console.log("clicked");
        }
     }}>
    <div class="projectv2-card-header">
        <div class="projectv2-header-left">
            <div class="projectv2-color" style="--project-color: var(--stratum-{color})"> </div>
            <div class="projectv2-name">{capitalize(name)}</div>
            <span role="none" onclick={(e) => e.stopPropagation()}>
                <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => handleFavoriteToggle()} ></IconButton>
            </span>
        </div>
        <div class="projectv2-header-right" role="none" onclick={(e) => e.stopPropagation()}>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
        </div>
    </div>
    <div class="projectv2-card-content">
        <div class="projectv2-tasks-completed">
            <div class="projectv2-percentage">{(totaltasks > 0) ? getCompletionPercent() : "--"}</div>
            <div class="projectv2-number">{(totaltasks > 0) ? completedtasks+"/"+totaltasks+" tasks" : "no tasks"}</div>
        </div>
        <div class="projectv2-progress-bar">
            <div class="projectv2-progress-bar-fill" style="--project-color: var(--stratum-{color}); width: {getCompletionPercent()};"></div>
        </div>
    </div>
    <div class="projectv2-card-footer">
        <Pill pillstate={priority} text={priority}></Pill>
        <div class="projectv2-footer-dates">
            <div class="projectv2-created">Created { formatDate(datecreated)}</div>
            -
            <div class="projectv2-deadline">Due {formatDate(deadline)}</div>
        </div>
    </div>
</div>