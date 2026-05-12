export const appState = $state({
    allExpanded: false,
    newTaskInfo: {
        isNewTaskModalOpen: false,
        parentProjectId: '',
        parentId: ''
    },
    deleteNodeInfo: {
        isDeleteConfirmModalOpen: false,
        nodeName: '',
        nodeId: ''
    },
    triggerTaskCardStateCheck: 0,
    triggerUpdateProjectsList: 0
})