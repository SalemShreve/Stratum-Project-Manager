import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import IconButton from './IconButton.svelte';
import StubIcon from '../../../test/StubIcon.svelte';
import StubToggleIcon from '../../../test/StubToggleIcon.svelte';
import type { IconEnum, SizeEnum } from '../../types/types';

vi.mock('../../types/types', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../types/types')>();
    return { ...actual, getIcon: vi.fn() };
});
import { getIcon } from '../../types/types';

let component: ReturnType<typeof mount> | undefined;

type IconButtonProps = {
    clickAction?: () => void;
    hoverAction?: () => void;
    kind: 'toggle' | 'transparent';
    icon: IconEnum;
    toggleIcon?: IconEnum;
    size: SizeEnum;
    isToggled?: boolean;
    isLoading?: boolean;
    isDisabled?: boolean;
    isSelected?: boolean;
    showLabel?: boolean;
    hasBorder?: boolean;
    title?: string;
    label?: string;
    testId?: string;
};

function defaults(overrides: Partial<IconButtonProps> = {}): IconButtonProps {
    return {
        kind: 'transparent',
        icon: 'home' as IconEnum,
        size: 'medium' as SizeEnum,
        ...overrides
    };
}

function renderButton(overrides: Partial<IconButtonProps> = {}) {
    component = mount(IconButton, { target: document.body, props: defaults(overrides) });
    flushSync();
    return button();
}

function button() {
    return document.querySelector<HTMLButtonElement>('button.icon-btn')!;
}

/** Mount, then wait for the async icon effect to settle and the DOM to catch up. */
async function renderAndSettle(overrides: Partial<IconButtonProps> = {}) {
    const el = renderButton(overrides);
    await vi.waitFor(() => {
        flushSync();
        expect(getIcon).toHaveBeenCalled();
    });
    flushSync();
    return el;
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getIcon).mockResolvedValue(StubIcon);
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

describe('IconButton', () => {
    describe('base markup', () => {
        test('applies the base, kind and size classes', () => {
            const el = renderButton({ kind: 'toggle', size: 'large' as SizeEnum });

            expect(el.classList.contains('icon-btn')).toBe(true);
            expect(el.classList.contains('toggle')).toBe(true);
            expect(el.classList.contains('large')).toBe(true);
        });

        test('applies no modifier classes by default', () => {
            const el = renderButton();

            expect(el.classList.contains('selected')).toBe(false);
            expect(el.classList.contains('toggled')).toBe(false);
            expect(el.classList.contains('labeled')).toBe(false);
            expect(el.classList.contains('bordered')).toBe(false);
            expect(el.classList.contains('reduceplayleft')).toBe(false);
        });

        test.each([
            ['isSelected', 'selected'],
            ['isToggled', 'toggled'],
            ['showLabel', 'labeled'],
            ['hasBorder', 'bordered']
        ] as const)('%s adds the %s class', (prop, className) => {
            const el = renderButton({ [prop]: true } as Partial<IconButtonProps>);

            expect(el.classList.contains(className)).toBe(true);
        });

        test('adds reduceplayleft only for the play icon', () => {
            expect(renderButton({ icon: 'play' as IconEnum }).classList.contains('reduceplayleft'))
                .toBe(true);
        });

        test('does not add reduceplayleft for other icons', () => {
            expect(renderButton({ icon: 'pause' as IconEnum }).classList.contains('reduceplayleft'))
                .toBe(false);
        });

        test('sets title and data-testid when given', () => {
            const el = renderButton({ title: 'Start timer', testId: 'timer-start' });

            expect(el.getAttribute('title')).toBe('Start timer');
            expect(el.getAttribute('data-testid')).toBe('timer-start');
        });

        test('omits title and data-testid when not given', () => {
            const el = renderButton();

            expect(el.hasAttribute('title')).toBe(false);
            expect(el.hasAttribute('data-testid')).toBe(false);
        });
    });

    describe('label', () => {
        test('renders no label by default', () => {
            renderButton({ label: 'Play' });

            expect(document.querySelector('.icon-btn-label')).toBeNull();
        });

        test('renders the label when showLabel is set', () => {
            renderButton({ showLabel: true, label: 'Play' });

            expect(document.querySelector('.icon-btn-label')?.textContent).toBe('Play');
        });

        test('renders an empty label element when showLabel is set without a label', () => {
            renderButton({ showLabel: true });

            expect(document.querySelector('.icon-btn-label')?.textContent).toBe('');
        });
    });

    describe('loading state', () => {
        test('renders the spinner instead of the icon while loading', async () => {
            await renderAndSettle({ isLoading: true });

            expect(document.querySelector('.icon-btn-spinner')).not.toBeNull();
            expect(document.querySelector('[data-testid="stub-icon"]')).toBeNull();
        });

        test('renders the icon and no spinner when not loading', async () => {
            await renderAndSettle();

            expect(document.querySelector('.icon-btn-spinner')).toBeNull();
            expect(document.querySelector('[data-testid="stub-icon"]')).not.toBeNull();
        });

        test('disables the button while loading', () => {
            expect(renderButton({ isLoading: true }).disabled).toBe(true);
        });
    });

    describe('disabled state', () => {
        test('is enabled by default', () => {
            expect(renderButton().disabled).toBe(false);
        });

        test('is disabled when isDisabled is set', () => {
            expect(renderButton({ isDisabled: true }).disabled).toBe(true);
        });

        test('does not call clickAction while disabled', () => {
            const clickAction = vi.fn();
            const el = renderButton({ clickAction, isDisabled: true });

            el.click();
            flushSync();

            expect(clickAction).not.toHaveBeenCalled();
        });

        test('does not call clickAction while loading', () => {
            const clickAction = vi.fn();
            const el = renderButton({ clickAction, isLoading: true });

            el.click();
            flushSync();

            expect(clickAction).not.toHaveBeenCalled();
        });
    });

    describe('interaction', () => {
        test('calls clickAction on click', () => {
            const clickAction = vi.fn();
            const el = renderButton({ clickAction });

            el.click();
            flushSync();

            expect(clickAction).toHaveBeenCalledOnce();
            expect(clickAction).toHaveBeenCalledWith();
        });

        test('does not throw when clicked without a clickAction', () => {
            const el = renderButton();

            expect(() => {
                el.click();
                flushSync();
            }).not.toThrow();
        });

        test('calls hoverAction on mouseenter', () => {
            const hoverAction = vi.fn();
            const el = renderButton({ hoverAction });

            el.dispatchEvent(new MouseEvent('mouseenter'));
            flushSync();

            expect(hoverAction).toHaveBeenCalledOnce();
        });

        test('does not throw on mouseenter without a hoverAction', () => {
            const el = renderButton();

            expect(() => {
                el.dispatchEvent(new MouseEvent('mouseenter'));
                flushSync();
            }).not.toThrow();
        });

        test('click does not trigger hoverAction', () => {
            const hoverAction = vi.fn();
            const el = renderButton({ hoverAction });

            el.click();
            flushSync();

            expect(hoverAction).not.toHaveBeenCalled();
        });
    });

    describe('icon selection', () => {
        test('requests the base icon when not toggled', async () => {
            await renderAndSettle({ icon: 'star' as IconEnum, size: 'small' as SizeEnum });

            expect(getIcon).toHaveBeenCalledWith('small', 'star');
        });

        test('requests the toggle icon when toggled', async () => {
            await renderAndSettle({
                icon: 'star' as IconEnum,
                toggleIcon: 'starfilled' as IconEnum,
                isToggled: true
            });

            expect(getIcon).toHaveBeenCalledWith('medium', 'starfilled');
        });

        test('renders the toggle icon component when toggled', async () => {
            vi.mocked(getIcon).mockResolvedValue(StubToggleIcon);

            await renderAndSettle({
                icon: 'star' as IconEnum,
                toggleIcon: 'starfilled' as IconEnum,
                isToggled: true
            });

            expect(document.querySelector('[data-testid="stub-toggle-icon"]')).not.toBeNull();
        });

        test('renders the base icon component when not toggled', async () => {
            vi.mocked(getIcon).mockImplementation(async (_size, icon) =>
                icon === 'starfilled' ? StubToggleIcon : StubIcon
            );

            await renderAndSettle({
                icon: 'star' as IconEnum,
                toggleIcon: 'starfilled' as IconEnum
            });

            expect(document.querySelector('[data-testid="stub-icon"]')).not.toBeNull();
            expect(document.querySelector('[data-testid="stub-toggle-icon"]')).toBeNull();
        });

        // Documents what happens when `toggleIcon` is omitted on a toggle button —
        // getIcon is handed `undefined` and nothing resolves to render.
        test('requests undefined when toggled with no toggleIcon', async () => {
            await renderAndSettle({ icon: 'star' as IconEnum, isToggled: true });

            expect(getIcon).toHaveBeenCalledWith('medium', undefined);
        });
    });
});