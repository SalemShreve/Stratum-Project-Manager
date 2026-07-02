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

type AppState = {
    breadCrumbPathArr: Array<Breadcrumb>,
    allExpanded: boolean;
    newTaskInfo: NewTaskInfo;
    deleteNodeInfo: DeleteNodeInfo;
    editNodeInfo: EditNodeInfo;
    triggerTaskCardStateCheck: number;
    triggerUpdateProjectsList: number;
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
    triggerTaskCardStateCheck: 0,
    triggerUpdateProjectsList: 0
})

type TaskPageState = {
    selectedTask: string | undefined
};

export const TaskPageState = $state<TaskPageState>({
    selectedTask: undefined,
})