import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import BreadCrumbPath from './BreadCrumbPath.svelte';
import { appState } from '../../../state/appState.svelte';

vi.mock('$app/navigation', () => ({
    goto: vi.fn()
}));
import { goto } from '$app/navigation';

let component: ReturnType<typeof mount> | undefined;

function renderComponent() {
    component = mount(BreadCrumbPath, {
        target: document.body,
        props: {}
    });
}

beforeEach(() => {
    vi.clearAllMocks();
    appState.breadCrumbPathArr = [
        { name: 'Home', path: '/' },
        { name: 'Second Location', path: '/secondlocation' },
        { name: 'Third Location', path: '/secondlocation/thirdlocation' }
    ];
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

function crumbLabels() {
    return [...document.querySelectorAll('.breadcrumb-link')].map((el) => el.textContent);
}

describe('BreadCrumbPath', () => {
    test('Displays With Path', () => {
        renderComponent();

        expect(crumbLabels()).toEqual(['Home', 'Second Location', 'Third Location']);
        expect(document.querySelectorAll('.breadcrumb-separator')).toHaveLength(2);
    });

    test('Reflects Change When Crumb Added', () => {
        renderComponent();

        appState.breadCrumbPathArr.push({
            name: 'Fourth Location',
            path: '/secondlocation/thirdlocation/fourthlocation'
        });
        flushSync();

        expect(crumbLabels()).toEqual([
            'Home',
            'Second Location',
            'Third Location',
            'Fourth Location'
        ]);
        expect(document.querySelectorAll('.breadcrumb-separator')).toHaveLength(3);
    });

    test('Displays Nothing With An Empty Trail', () => {
        appState.breadCrumbPathArr = [];
        renderComponent();

        expect(crumbLabels()).toEqual([]);
    });

    test('Navigates To The Clicked Crumb', () => {
        renderComponent();

        const buttons = document.querySelectorAll<HTMLButtonElement>('.breadcrumb-link');
        buttons[1].click();
        flushSync();

        expect(goto).toHaveBeenCalledOnce();
        expect(goto).toHaveBeenCalledWith('/secondlocation');
    });

    test('Truncates The Trail To The Clicked Crumb', () => {
        renderComponent();

        const buttons = document.querySelectorAll<HTMLButtonElement>('.breadcrumb-link');
        buttons[1].click();
        flushSync();

        expect(appState.breadCrumbPathArr.map((c) => c.name)).toEqual(['Home', 'Second Location']);
        expect(crumbLabels()).toEqual(['Home', 'Second Location']);
    });

    test('Leaves The Trail Alone When The Last Crumb Is Clicked', () => {
        renderComponent();

        const buttons = document.querySelectorAll<HTMLButtonElement>('.breadcrumb-link');
        buttons[buttons.length - 1].click();
        flushSync();

        expect(appState.breadCrumbPathArr).toHaveLength(3);
    });
});