<script lang="ts">
    import "./TaskCard.css";
    import IconButton from "../../IconButton/IconButton.svelte";
    import TaskCard from "./TaskCard.svelte";
    import {type ColorEnum, mapTaskToProps, type Priority, type Status, type Task} from "../../../types/types";
    import {invoke} from "@tauri-apps/api/core";
    import {appState} from "../../../../state/appState.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import Timer from "../../Timer/Timer.svelte";
    import StatusPopover from "../../StatusPopover/StatusPopover.svelte";

    let {
        id,
        parentprojectid,
        parentid,
        name,
        color,
        favorite,
        datecreated,
        estimateddays,
        active,
        laststarted,
        minutesworked,
        priority,
        status,
        isVisible,
        isParentLastInDepth
    } = $props<{
        id: string,
        parentprojectid: string,
        parentid: string,
        name: string,
        color: ColorEnum | undefined,
        favorite: boolean,
        datecreated: Date,
        estimateddays: number,
        active: boolean,
        laststarted: string,
        minutesworked: number,
        priority: Priority;
        status: Status;
        isVisible: boolean,
        isParentLastInDepth: boolean,
    }>();

    let areChildrenShown = $state(appState.allExpanded);
    let isFavoriteState = $derived(favorite);
    let isLastCard = $state(false)
    let isLastInDepth = $state(false)
    let isSiblingAboveExtended = $state(false)

    let children = $state<Task[]>([]);

    let taskEl = $state<HTMLElement>();

    function getStateFromSiblings() {
        if (!taskEl) return;

        const parent = taskEl.parentElement;
        if (!parent) return;

        const siblings = Array.from(parent.children)

        siblings.forEach((sibling) => {
            if (sibling.id === taskEl?.id) {
                if (siblings.indexOf(sibling) === (siblings.length - 1) && isParentLastInDepth) {
                    isLastInDepth = true
                }

                if ( siblings[siblings.indexOf(sibling)-1] ) {
                   let siblingAbove = siblings[siblings.indexOf(sibling)-1]


                    isSiblingAboveExtended = siblingAbove.className === "task-card expanded";
                }
            }
        })
    }

    function getSiblings() {
        if (!taskEl) return;

        const parent = taskEl.parentElement;
        if (!parent) return;

        const siblings = Array.from(parent.children)

        if (areChildrenShown && children.length != 0 || !isParentLastInDepth ) {
            isLastCard = false
        }
        else if (siblings.length === 1 && !areChildrenShown) {
            isLastCard = true
        }
        else {
            siblings.forEach((sibling) => {
                if (sibling.id === taskEl?.id) {

                    if (siblings.indexOf(sibling) === (siblings.length - 1)) {
                        isLastCard = true
                    }
                }
            })
        }
    }

    async function loadTaskChildren() {
        children = await invoke<Task[]>("get_tasks", { parentId: id, nodeType: 1 });
    }

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = id;
        appState.newTaskInfo.parentProjectId = parentprojectid;
        appState.newTaskInfo.parentTaskId = id;

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleExpandBtnClicked() {
        areChildrenShown = !areChildrenShown

        appState.triggerTaskCardStateCheck += 1

        getStateFromSiblings();

        if (areChildrenShown || isParentLastInDepth) {
            isLastCard = false
        }
        else {
            getSiblings();
        }
    }

    function handleEditBtnClicked() {
        appState.editNodeInfo.nodeId = id
        appState.editNodeInfo.nodeType = "task";
        appState.editNodeInfo.isEditModalOpen = true;
        console.log(appState.editNodeInfo)
    }

    async function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = id
        appState.deleteNodeInfo.nodeName = name
        appState.deleteNodeInfo.nodeType = "task";

        appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;

        // await invoke<Task[]>("delete_task", { taskId: id});
    }

    $effect(() => {
        loadTaskChildren();
    });

    $effect(() => {
        if (children.length === 0) {
            areChildrenShown = false;
        }
        else {
            areChildrenShown = appState.allExpanded;
        }
    });

    $effect(() => {
        if (isVisible === true) {
            getStateFromSiblings();
            getSiblings();
        }
    })

    $effect(() => {
        appState.triggerTaskCardStateCheck

        getStateFromSiblings();
        getSiblings();
    })

</script>

<div class="task-card" bind:this={taskEl} id={id} class:last={isLastCard} class:expanded={areChildrenShown && children.length !== 0}>
    <div class="task-card-container">
        <div class="task-card-container-left" class:last={isLastCard} class:above-sibling-extended={isSiblingAboveExtended} class:expanded={areChildrenShown && children.length !== 0} style="--project-color: var(--stratum-{color})">
            {#if children.length !== 0}
                <IconButton kind="transparent" size="small" icon="chevronright" toggleIcon="chevrondown" isToggled={areChildrenShown} clickAction={() => handleExpandBtnClicked()}></IconButton>
                {:else}
                <span style="width: 5px"></span>
            {/if}
            <span class="task-card-name {status}" title={name}>
                {name}
            </span>
<!--            <IconButton kind="transparent" size="small" icon="star" toggleIcon="starfilled" isToggled={isFavoriteState} clickAction={() => isFavoriteState = !isFavoriteState} ></IconButton>-->
            {#if children.length !== 0}
                <Pill text="{children.length} Tasks"></Pill>
            {/if}
        </div>
        <div class="project-card-container-middle">
            <div class="metadata-priority">
                <Pill text={priority} pillstate={priority}></Pill>
            </div>
            {#if children.length === 0}
                <StatusPopover taskid={id} bind:statusState={status} ></StatusPopover>
                <Timer></Timer>
            {/if}
            <div class="divider"></div>
            <div class="metadata-createddate" title="Date Created">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="2" y="4" width="20" height="18" rx="2"/>
                    <line x1="2" y1="10" x2="22" y2="10"/>
                    <line x1="7" y1="2" x2="7" y2="6"/>
                    <line x1="17" y1="2" x2="17" y2="6"/>
                </svg>
                {formatDate(datecreated)}
            </div>
            <div class="metadata-estimate" title="Task Estimate">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {estimateddays} days
            </div>
        </div>
        <div class="task-card-container-right">
            <div class="divider"></div>
            <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
            <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
        </div>
    </div>
    <div class="task-container" class:hidden={!areChildrenShown || children.length === 0} >
        {#each children as task}
            {@const props = mapTaskToProps(task)}
            <TaskCard {...props} isVisible={areChildrenShown} isParentLastInDepth={isLastInDepth} />
        {/each}
    </div>
</div>