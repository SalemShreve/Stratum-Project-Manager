export const appState = $state({
    allExpanded: false,
    newTaskInfo: {
        isNewTaskModalOpen: false,
        parentProjectId: '',
        parentId: ''
    },
    triggerTaskCardStateCheck: 0,
    triggerUpdateProjectsList: 0
})