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
};

type AppState = {
    allExpanded: boolean;
    newTaskInfo: NewTaskInfo;
    deleteNodeInfo: DeleteNodeInfo;
    triggerTaskCardStateCheck: number;
    triggerUpdateProjectsList: number;
};

export const appState = $state<AppState>({
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
        nodeId: undefined
    },
    triggerTaskCardStateCheck: 0,
    triggerUpdateProjectsList: 0
})