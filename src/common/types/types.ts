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

export type  IconEnum =
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
    | 'star'
    | 'starfilled';

export type SizeEnum = 'small' | 'medium' | 'large';

export type ColorEnum =
    'red'
    | 'green'
    | 'blue'
    | 'purple'
    | 'orange'
    | 'yellow'
    | 'teal'
    | 'pink'
    | 'indigo'
    | 'lime'
    | 'coral'
    | 'sky'
    | 'rose'
    | 'amber';

export async function getIcon(size: SizeEnum, icon: IconEnum) {
    const iconMap: Record<string, any> = {
        search: sized(size, SearchIcon16, SearchIcon24, SearchIcon32),
        home: sized(size,HomeIcon16, HomeIcon24, HomeIcon32),
        edit: sized(size,EditIcon16, EditIcon24, EditIcon32),
        sprint: sized(size,SprintIcon16, SprintIcon24, SprintIcon32),
        sidebar: sized(size,SidebarIcon16, SidebarIcon24,  SidebarIcon32),
        stratum: sized(size,StratumIcon16, StratumIcon24,  StratumIcon32),
        settings: sized(size,SettingsIcon16, SettingsIcon24,  SettingsIcon32),
        gantt: sized(size,GanttIcon16, GanttIcon24,  GanttIcon32),
        calendar: sized(size,CalendarIcon16, CalendarIcon24,  CalendarIcon32),
        add: sized(size,AddIcon16, AddIcon24, AddIcon32),
        close: sized(size,CloseIcon16, CloseIcon24, CloseIcon32),
        trash: sized(size,TrashIcon16, TrashIcon24, TrashIcon32),
        chevronright: sized(size,ChevronRightIcon16, ChevronRightIcon24, ChevronRightIcon32),
        star: sized(size,StarIcon16, StarIcon24, StarIcon32),
        starfilled: sized(size,StarFilledIcon16, StarFilledIcon24, StarFilledIcon32),
    };

    return iconMap[icon];
}

export async function sized(size: SizeEnum, s16: any, s24: any, s32: any) {
    return size === 'small' ? s16 : size === 'large' ? s32 : s24;
}