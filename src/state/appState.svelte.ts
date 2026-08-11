import type {Breadcrumb} from "../common/types/types";

type NewTaskInfo = {
    isNewTaskModalOpen: boolean;
    parentProjectId: string | undefined;
    parentTaskId: string | undefined;
    parentId: string | undefined;
};

type DeleteNodeInfo = {
    isDeleteConfirmModalOpen: boolean;
    nodeName: string | undefined;
    nodeId: string | undefined;
    nodeType: "project" | "task" | undefined;
};

type EditNodeInfo = {
    isEditModalOpen: boolean;
    nodeType: "project" | "task" | "folder" | undefined;
    nodeId: string | undefined;
};

type EditTaskInfo = {
    isEditTaskModalOpen: boolean;
    taskId: string | undefined;
};

type AppState = {
    breadCrumbPathArr: Array<Breadcrumb>,
    allExpanded: boolean;
    newTaskInfo: NewTaskInfo;
    deleteNodeInfo: DeleteNodeInfo;
    editNodeInfo: EditNodeInfo;
    editTaskInfo: EditTaskInfo;
    triggerTaskCardStateCheck: number;
    triggerUpdateTask: string | undefined,
    triggerUpdateProjectsList: number;
    filterUpdateTrigger: number;
    sortUpdateTrigger: number;
};

export const appState = $state<AppState>({
    breadCrumbPathArr: new Array<Breadcrumb>({name: "Projects", path: "/projects"}),
    allExpanded: false,
    newTaskInfo: {
        isNewTaskModalOpen: false,
        parentProjectId: undefined,
        parentTaskId: undefined,
        parentId: undefined
    },
    deleteNodeInfo: {
        isDeleteConfirmModalOpen: false,
        nodeName: undefined,
        nodeId: undefined,
        nodeType: undefined,
    },
    editNodeInfo: {
        isEditModalOpen: false,
        nodeType: undefined,
        nodeId: undefined,
    },
    editTaskInfo: {
        isEditTaskModalOpen: false,
        taskId: undefined,
    },
    triggerTaskCardStateCheck: 0,
    triggerUpdateTask: undefined,
    triggerUpdateProjectsList: 0,
    filterUpdateTrigger: 0,
    sortUpdateTrigger: 0
})

type TaskUpdateTrigger = {
    taskUpdateIdTrigger: string | undefined
};
export const TaskUpdateTrigger = $state<TaskUpdateTrigger>({
    taskUpdateIdTrigger: undefined,
})