import SearchIcon16 from "../icons/SearchIcon/SearchIcon16.svelte";
import SearchIcon24 from "../icons/SearchIcon/SearchIcon24.svelte";
import SearchIcon32 from "../icons/SearchIcon/SearchIcon32.svelte";
import HomeIcon16 from "../icons/HomeIcon/HomeIcon16.svelte";
import HomeIcon24 from "../icons/HomeIcon/HomeIcon24.svelte";
import HomeIcon32 from "../icons/HomeIcon/HomeIcon32.svelte";
import EditIcon16 from "../icons/EditIcon/EditIcon16.svelte";
import EditIcon24 from "../icons/EditIcon/EditIcon24.svelte";
import EditIcon32 from "../icons/EditIcon/EditIcon32.svelte";
import SprintIcon16 from "../icons/SprintIcon/SprintIcon16.svelte";
import SprintIcon24 from "../icons/SprintIcon/SprintIcon24.svelte";
import SprintIcon32 from "../icons/SprintIcon/SprintIcon32.svelte";
import SidebarIcon16 from "../icons/SidebarIcon/SidebarIcon16.svelte";
import SidebarIcon24 from "../icons/SidebarIcon/SidebarIcon24.svelte";
import SidebarIcon32 from "../icons/SidebarIcon/SidebarIcon32.svelte";
import StratumIcon16 from "../icons/StratumIcon/StratumIcon16.svelte";
import StratumIcon24 from "../icons/StratumIcon/StratumIcon24.svelte";
import StratumIcon32 from "../icons/StratumIcon/StratumIcon32.svelte";
import SettingsIcon16 from "../icons/SettingsIcon/SettingsIcon16.svelte";
import SettingsIcon24 from "../icons/SettingsIcon/SettingsIcon24.svelte";
import SettingsIcon32 from "../icons/SettingsIcon/SettingsIcon32.svelte";
import GanttIcon16 from "../icons/GanttIcon/GanttIcon16.svelte";
import GanttIcon24 from "../icons/GanttIcon/GanttIcon24.svelte";
import GanttIcon32 from "../icons/GanttIcon/GanttIcon32.svelte";
import CalendarIcon16 from "../icons/CalendarIcon/CalendarIcon16.svelte";
import CalendarIcon24 from "../icons/CalendarIcon/CalendarIcon24.svelte";
import CalendarIcon32 from "../icons/CalendarIcon/CalendarIcon32.svelte";
import AddIcon16 from "../icons/AddIcon/AddIcon16.svelte";
import AddIcon24 from "../icons/AddIcon/AddIcon24.svelte";
import AddIcon32 from "../icons/AddIcon/AddIcon32.svelte";
import CloseIcon16 from "../icons/CloseIcon/CloseIcon16.svelte";
import CloseIcon24 from "../icons/CloseIcon/CloseIcon24.svelte";
import CloseIcon32 from "../icons/CloseIcon/CloseIcon32.svelte";
import TrashIcon16 from "../icons/TrashIcon/TrashIcon16.svelte";
import TrashIcon24 from "../icons/TrashIcon/TrashIcon24.svelte";
import TrashIcon32 from "../icons/TrashIcon/TrashIcon32.svelte";
import ChevronRightIcon24 from "../icons/ChevronRightIcon/ChevronRightIcon24.svelte";
import ChevronRightIcon32 from "../icons/ChevronRightIcon/ChevronRightIcon32.svelte";
import ChevronRightIcon16 from "../icons/ChevronRightIcon/ChevronRightIcon16.svelte";
import StarIcon16 from "../icons/StarIcon/StarIcon16.svelte";
import StarIcon24 from "../icons/StarIcon/StarIcon24.svelte";
import StarIcon32 from "../icons/StarIcon/StarIcon32.svelte";
import StarFilledIcon16 from "../icons/StarFilledIcon/StarFilledIcon16.svelte";
import StarFilledIcon24 from "../icons/StarFilledIcon/StarFilledIcon24.svelte";
import StarFilledIcon32 from "../icons/StarFilledIcon/StarFilledIcon32.svelte";
import ChevronDown16 from "../icons/ChevronDownIcon/ChevronDown16.svelte";
import ChevronDown24 from "../icons/ChevronDownIcon/ChevronDown24.svelte";
import ChevronDown32 from "../icons/ChevronDownIcon/ChevronDown32.svelte";
import Check16 from "../icons/CheckIcon/Check16.svelte";
import ExpandAll16 from "../icons/ExpandAllIcon/ExpandAll16.svelte";
import CollapseAll16 from "../icons/CollapseAllIcon/CollapseAll16.svelte";
import PauseIcon16 from "../icons/PauseIcon/PauseIcon16.svelte";
import PlayIcon16 from "../icons/PlayIcon/PlayIcon16.svelte";
import StopIcon16 from "../icons/StopIcon/StopIcon16.svelte";
import MarkCompleted16 from "../icons/MarkCompletedIcon/MarkCompleted16.svelte";
import MarkIncompleted16 from "../icons/MarkIncompletedIcon/MarkIncompleted16.svelte";
import MarkBlocked16 from "../icons/MarkBlockedIcon/MarkBlocked16.svelte";
import Grid24 from "../icons/GridIcon/Grid24.svelte";

export type Breadcrumb = {
    name: string;
    path: string;
}

export type Status = "completed" | "incompleted" | "blocked"

export type Priority = "low" | "medium" | "high"

export type IconEnum =
    | 'edit'
    | 'search'
    | 'home'
    | 'sidebar'
    | "stratum"
    | 'sprint'
    | 'settings'
    | 'gantt'
    | 'calendar'
    | 'add'
    | 'close'
    | 'trash'
    | 'chevronright'
    | 'chevrondown'
    | 'star'
    | 'starfilled'
    | 'check'
    | 'expandall'
    | 'collapseall'
    | 'pause'
    | 'play'
    | 'stop'
    | 'completed'
    | 'incompleted'
    | 'blocked'
    | 'grid';

export type SizeEnum = 'small' | 'medium' | 'large';

export type SortEnum = "name" | "deadline" | "priority" | "state" | "created" | undefined

export type UpdateTaskStateKeyEnum = "Task Row" | "Task Display Panel"

export type UpdateTaskStateEnum = "ready" | "working" | "finished"

export const COLOR_VALUES = [
    'red', 'green', 'blue', 'purple', 'orange', 'yellow',
    'teal', 'pink', 'indigo', 'lime', 'coral', 'sky', 'rose'
] as const;

export type ColorEnum = typeof COLOR_VALUES[number];

export async function getIcon(size: SizeEnum, icon: IconEnum) {
    const iconMap: Record<string, any> = {
        search:       sized(size, SearchIcon16, SearchIcon24, SearchIcon32),
        home:         sized(size,HomeIcon16, HomeIcon24, HomeIcon32),
        edit:         sized(size,EditIcon16, EditIcon24, EditIcon32),
        sprint:       sized(size,SprintIcon16, SprintIcon24, SprintIcon32),
        sidebar:      sized(size,SidebarIcon16, SidebarIcon24,  SidebarIcon32),
        stratum:      sized(size,StratumIcon16, StratumIcon24,  StratumIcon32),
        settings:     sized(size,SettingsIcon16, SettingsIcon24,  SettingsIcon32),
        gantt:        sized(size,GanttIcon16, GanttIcon24,  GanttIcon32),
        calendar:     sized(size,CalendarIcon16, CalendarIcon24,  CalendarIcon32),
        add:          sized(size,AddIcon16, AddIcon24, AddIcon32),
        close:        sized(size,CloseIcon16, CloseIcon24, CloseIcon32),
        trash:        sized(size,TrashIcon16, TrashIcon24, TrashIcon32),
        chevronright: sized(size,ChevronRightIcon16, ChevronRightIcon24, ChevronRightIcon32),
        chevrondown:  sized(size, ChevronDown16,ChevronDown24,ChevronDown32),
        star:         sized(size,StarIcon16, StarIcon24, StarIcon32),
        starfilled:   sized(size,StarFilledIcon16, StarFilledIcon24, StarFilledIcon32),
        check:        Check16,
        expandall:    ExpandAll16,
        collapseall:  CollapseAll16,
        pause:        PauseIcon16,
        play:         PlayIcon16,
        stop:         StopIcon16,
        completed:    MarkCompleted16,
        incompleted:  MarkIncompleted16,
        blocked:      MarkBlocked16,
        grid:         Grid24
    };

    return iconMap[icon];
}

export async function sized(size: SizeEnum, s16: any, s24: any, s32: any) {
    return size === 'small' ? s16 : size === 'large' ? s32 : s24;
}

export interface Project {
    id: string;
    name: string;
    color: ColorEnum;
    favorite: boolean;
    datecreated: string;
    deadline: string;
    milisecworked: number;
    priority: Priority;
    totaltasks: number;
    completedtasks: number;
    createdby: string;
}

export interface IProjectCard  {
    id: string;
    name: string;
    color: ColorEnum;
    favorite: boolean;
    datecreated: string;
    deadline: string;
    priority: Priority;
    totaltasks: number;
    completedtasks: number;
}

export interface ProjectCard  {
    id: string;
    name: string;
    color: ColorEnum;
    favorite: boolean;
    dateCreated: Date;
    deadline: Date;
    milisecworked: number;
    priority: Priority;
    totaltasks: number;
    completedtasks: number;
    createdBy: string;
}

export function mapProjectToProps(project: Project) {
    return {
        id:             project.id,
        name:           project.name,
        color:          project.color,
        favorite:       project.favorite,
        dateCreated:    new Date(project.datecreated),
        deadline:       new Date(project.deadline),
        milisecWorked:  project.milisecworked,
        priority:       project.priority,
        createdBy:      project.createdby,
        totaltasks:     project.totaltasks,
        completedtasks: project.completedtasks
    };
}

export interface Task {
    id: string,
    parentprojectid: string,
    parentid: string,
    name: string,
    color: ColorEnum,
    favorite: boolean,
    datecreated: Date,
    estimatedhours: number,
    active: boolean,
    laststarted: number,
    milisecworked: number,
    priority: Priority,
    status: Status,
    totaltasks: number,
    completedtasks: number,
    createdby: string,
}

export interface TaskTimeInfo {
    active: boolean,
    laststarted: number,
    milisecworked: number,
    accumulated: number,
}

export interface ITaskCard {
    id: string,
    parentprojectid: string,
    parentid: string,
    name: string,
    active: boolean,
    priority: Priority,
    status: Status,
    totaltasks: number,
    completedtasks: number,
    color: ColorEnum,
    datecreated: Date,
}

export function mapTaskToProps(task: Task ): Task {
    return {
        id: task.id,
        parentprojectid: task.parentprojectid,
        parentid: task.parentid,
        name: task.name,
        color: task.color,
        favorite: task.favorite,
        datecreated: new Date(task.datecreated),
        estimatedhours: task.estimatedhours,
        active: task.active,
        laststarted: task.laststarted,
        milisecworked: task.milisecworked,
        priority: task.priority,
        status: task.status,
        totaltasks: task.totaltasks,
        completedtasks: task.completedtasks,
        createdby: task.createdby,
    };
}