<script lang="ts">
    import "./TaskDisplayPanel.css"
    import type {Project, Task} from "../../../types/types";
    import {appState} from "../../../../state/appState.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {untrack} from "svelte";
    import IconButton from "../../IconButton/IconButton.svelte";
    import Stopwatch from "../../Stopwatch/Stopwatch.svelte";
    import StatusPopover from "../../StatusPopover/StatusPopover.svelte";

    let {
        taskid,
    } = $props<{
        taskid: string | undefined;
    }>();

    let task = $state<Task>();
    let project = $state<Project>();

    let active = $state(true);

    async function loadTaskData() {
        task = await invoke<Task>("get_task" , { taskId: taskid });

        project = await invoke<Project>("get_project" , { projectId: task.parentprojectid });
    }

    $effect(() => {
        if (taskid !== undefined ) {
            untrack(() => {
                loadTaskData()
                active = true
                }
            );
        } else { active = false}
    });

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    function getCompletionPercent() {
        if (task !== undefined) {
            if (task.totaltasks > 0) {
                return Math.round((task.completedtasks / task.totaltasks) * 100).toString() + "%";
            } else return "0%";
        }
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = taskid;
        appState.newTaskInfo.parentProjectId = task?.parentprojectid;
        appState.newTaskInfo.parentTaskId = taskid;

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleEditBtnClicked() {
        appState.editNodeInfo.nodeId = taskid
        appState.editNodeInfo.nodeType = "task";
        appState.editNodeInfo.isEditModalOpen = true;
        console.log(appState.editNodeInfo)
    }

    async function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = taskid
        appState.deleteNodeInfo.nodeName = task?.name
        appState.deleteNodeInfo.nodeType = "task";

        appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
    }

</script>

<div class="tdp">
    {#if task !== undefined && project !== undefined }
        <div class="tdp-header">
            <div class="tdp-header-metadata">
                <div class="tdp-header-project-name"
                     style="background: var(--bg-stratum-{task.color}); border: 1px solid var(--accent-stratum-{task.color});">
                    <div class="tdp-project-name-swatch" style="background: var(--stratum-{task.color})"></div>
                    <div class="tdp-project-name">{project.name.charAt(0).toUpperCase() + project.name.slice(1)}</div>
                </div>
                <div class="tdp-header-actions">
                    <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
                    <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
                    <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
                </div>
            </div>
            <h1 class="tdp-header-task-name">{task.name.charAt(0).toUpperCase() + task.name.slice(1)}</h1>
            <div class="tdp-header-info">
                <Pill text={task.priority + " Priority"} pillstate={task.priority}></Pill>
                {#if task.totaltasks > 0}
                    <Pill text={task.status} pillstate={task.status} ></Pill>
                    {:else }
                    <StatusPopover taskid={task.id} statusState={task.status}></StatusPopover>
                {/if}

                <Pill text={task.totaltasks > 0 ? "group" : "task"} pillstate={task.totaltasks > 0 ? "group" : undefined}></Pill>
            </div>
        </div>
        <div class="tdp-content">
            {#if task.totaltasks <= 0}
                <Stopwatch taskid={task.id}></Stopwatch>
            {/if}
            <div class="tdp-progress">
                <div class="tdp-progress-header">
                    <div class="tdp-progress-label">Progress</div>
                    <div class="tdp-progress-values">
                        <div class="tdp-progress-percentage">{(task.totaltasks > 0) ? getCompletionPercent() : "--"}</div>
                        <div class="tdp-progress-number">{(task.totaltasks > 0) ? task.completedtasks+"/"+task.totaltasks+" tasks" : "no tasks"}</div>
                    </div>
                </div>
                <div class="tdp-progress-bar">
                    <div class="tdp-progress-bar-fill" style="--project-color: var(--stratum-{task.color}); width: {getCompletionPercent()};"></div>
                </div>
            </div>
            <div class="tdp-info-grid">
                <div class="tdp-info-square top left">
                    <span class="info-label">Created</span>
                    <span class="info-value">{formatDate(new Date(task.datecreated))}</span>
                </div>
                <div class="tdp-info-square top">
                    <span class="info-label">Due Date</span>
                    <span class="info-value">{formatDate(new Date(project.deadline))}</span>
                </div>
                <div class="tdp-info-square left">
                    <span class="info-label">Estimate</span>
                    <span class="info-value">{task.estimateddays}h</span>
                </div>
                <div class="tdp-info-square">
                    <span class="info-label">Time Worked</span>
                    <span class="info-value">{task.minutesworked}h</span>
                </div>
                <div class="tdp-info-square bottom left">
                    <span class="info-label">Remaining</span>
                    <span class="info-value">{Math.abs(task.estimateddays - task.minutesworked)}h</span>
                </div>
                <div class="tdp-info-square bottom">
                    <span class="info-label">Subtasks</span>
                    <span class="info-value">{task.totaltasks}</span>
                </div>

            </div>
        </div>
        <div class="tdp-subtasks"></div>
    {/if}
</div>