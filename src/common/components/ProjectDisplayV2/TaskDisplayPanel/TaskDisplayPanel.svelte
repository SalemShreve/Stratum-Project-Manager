<script lang="ts">
    import "./TaskDisplayPanel.css"
    import type {Project, Task} from "../../../types/types";
    import {appState, appStateV2} from "../../../../state/appState.svelte";
    import Pill from "../../Pill/Pill.svelte";
    import {invoke} from "@tauri-apps/api/core";
    import {untrack} from "svelte";
    import IconButton from "../../IconButton/IconButton.svelte";
    import Stopwatch from "../../Stopwatch/Stopwatch.svelte";
    import StatusPopover from "../../StatusPopover/StatusPopover.svelte";
    import {capitalize} from "../../../utils/utils";

    let {
        selectedTaskId,
    } = $props<{
        selectedTaskId: string | undefined;
    }>();

    let task = $state<Task>();
    let project = $state<Project>();

    async function loadTaskData() {
        task = await invoke<Task>("get_task" , { taskId: selectedTaskId });
        project = await invoke<Project>("get_project" , { projectId: task.parentprojectid });

        if (task.totaltasks > 0) {
            task.milisecworked = await invoke("get_total_time_worked", {taskId: selectedTaskId})
        }
    }

    async function updateTaskInfo() {
        task = await invoke<Task>("get_task" , { taskId: selectedTaskId });
    }

    $effect(() => {
        appStateV2.updateTask
        untrack(() => {
            updateTaskInfo();
        });
    });

    $effect(() => {
        if (selectedTaskId !== undefined ) {
            untrack(() => {
                loadTaskData()
                }
            );
        }
    });

    function formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    function format(ms: number) {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return (
            String(hours).padStart(2, '0') + ':' +
            String(minutes).padStart(2, '0') + ':' +
            String(seconds).padStart(2, '0')
        );
    }

    function getCompletionPercent() {
        if (task !== undefined) {
            if (task.totaltasks > 0) {
                return Math.round((task.completedtasks / task.totaltasks) * 100).toString() + "%";
            } else return "0%";
        }
    }

    function handleNewTaskBtnClicked() {
        appState.newTaskInfo.parentId = selectedTaskId;
        appState.newTaskInfo.parentProjectId = task?.parentprojectid;
        appState.newTaskInfo.parentTaskId = selectedTaskId;

        appState.newTaskInfo.isNewTaskModalOpen = true;
    }

    function handleEditBtnClicked() {
        appState.editTaskInfo.taskId = selectedTaskId
        appState.editTaskInfo.isEditTaskModalOpen = true;
    }

    async function handleTrashBtnClicked() {
        appState.deleteNodeInfo.nodeId = selectedTaskId
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
                    <div class="tdp-project-name">{capitalize(project.name)}</div>
                </div>
                <div class="tdp-header-actions">
                    <IconButton kind="transparent" size="small" icon="add" clickAction={() => handleNewTaskBtnClicked()}/>
                    <IconButton kind="transparent" size="small" icon="edit" clickAction={() => handleEditBtnClicked()}/>
                    <IconButton kind="transparent" size="small" icon="trash" clickAction={() => handleTrashBtnClicked()}/>
                </div>
            </div>
            <h1 class="tdp-header-task-name">{capitalize(task.name)}</h1>
            <div class="tdp-header-info">
                <Pill text={task.priority + " Priority"} pillstate={task.priority}></Pill>
                {#if task.totaltasks > 0}
                    <Pill text={task.status} pillstate={task.status} ></Pill>
                    {:else }
                    <StatusPopover taskid={task.id} parenttaskid={task.parentid} statusState={task.status}></StatusPopover>
                {/if}

                <Pill text={task.totaltasks > 0 ? "group" : "task"} pillstate={task.totaltasks > 0 ? "group" : undefined}></Pill>
            </div>
        </div>
        <div class="tdp-content">
            {#if task.totaltasks <= 0}
                <Stopwatch onSubmit={() => loadTaskData()} taskid={task.id}></Stopwatch>
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
                <div class="tdp-info-square left top">
                    <span class="info-label">Time Worked</span>
                    <span class="info-value">{format(task.milisecworked)}</span>
                </div>
                <div class="tdp-info-square top">
                    <span class="info-label">Created</span>
                    <span class="info-value">{formatDate(new Date(task.datecreated))}</span>
                </div>
                <div class="tdp-info-square left">
                    <span class="info-label">Estimate</span>
                    <span class="info-value">{task.estimatedhours === 0 ? '--' : task.estimatedhours +'h'}</span>
                </div>
                <div class="tdp-info-square">
                    <span class="info-label">Due Date</span>
                    <span class="info-value">{formatDate(new Date(project.deadline))}</span>
                </div>
                <div class="tdp-info-square left bottom">
                    <span class="info-label">Remaining</span>
                    <span class="info-value">{task.estimatedhours === 0 ? '--' : format(Math.abs((task.estimatedhours * 3600000) - task.milisecworked))}</span>
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