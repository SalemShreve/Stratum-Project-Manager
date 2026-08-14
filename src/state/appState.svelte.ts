import type {Breadcrumb, SortEnum, UpdateTaskStateEnum, UpdateTaskStateKeyEnum} from "../common/types/types";

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
    triggerUpdateProjectsList: 0,
    filterUpdateTrigger: 0,
    sortUpdateTrigger: 0
})

class AppStateV2 {
    activeFilters = $state<string[]>([]);
    activeSort = $state<SortEnum>(undefined);

    taskCardStateCheck= $state<number>(0);
    triggerTaskCardStateCheck() {
        this.taskCardStateCheck++;
    }

    updateProjectsList= $state<number>(0);
    triggerUpdateProjectsList() {
        this.updateProjectsList++;
    }

    updateTask= $state<string | undefined>(undefined);
    updateTaskStateMap= $state<Map<string,UpdateTaskStateEnum>>(new Map([["Task Row","ready"],["Task Display Panel", "ready"]]));
    triggerUpdateTask(taskId: string) {
        this.updateTask = taskId;

        console.log("Update Triggered")
    }
    getUpdateTaskStateValue(key: UpdateTaskStateKeyEnum) {
        return this.updateTaskStateMap.get(key);
    }
    setUpdateTaskStateWorking(key: UpdateTaskStateKeyEnum) {
        this.updateTaskStateMap.set(key,"working")
    }
    setUpdateTaskStateFinished(key: UpdateTaskStateKeyEnum) {
        this.updateTaskStateMap.set(key,"finished")
        console.log("Update task state finished on: ", key);
    }
    resetUpdateTask() {
        console.log("Reset Called")
        console.log(this.updateTaskStateMap)
        console.log(this.updateTaskStateMap.values().toArray().every(() =>"finished"))

        if (this.updateTaskStateMap.values().toArray().every(() =>"finished")) {
            this.updateTask = undefined;
            console.log("Reset Executed")

            this.updateTaskStateMap.forEach((value, key,map) => { map.set(key,"ready") })
        } else console.log("Not all updates finished")
    }
}

export const appStateV2 = new AppStateV2();

type TaskUpdateTrigger = {
    taskUpdateIdTrigger: string | undefined
};
export const TaskUpdateTrigger = $state<TaskUpdateTrigger>({
    taskUpdateIdTrigger: undefined,
})