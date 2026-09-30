import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Chip from './Chip.svelte';

let component: ReturnType<typeof mount> | undefined;

type ChipProps = {
    text: string;
    clickAction?: () => void;
    active?: boolean;
    disabled?: boolean;
    starred?: boolean;
    priority?: 'low' | 'medium' | 'high';
};

function renderChip(props: ChipProps) {
    component = mount(Chip, { target: document.body, props });
    return document.querySelector<HTMLButtonElement>('button.chip')!;
}

beforeEach(() => {
    vi.clearAllMocks();
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

describe('Chip', () => {
    describe('rendering', () => {
        test('renders the text it is given', () => {
            const button = renderChip({ text: 'In Progress' });

            expect(button.textContent?.trim()).toBe('In Progress');
        });

        test('renders an empty label without breaking', () => {
            const button = renderChip({ text: '' });

            expect(button.textContent?.trim()).toBe('');
        });

        test('always carries the base chip class', () => {
            const button = renderChip({ text: 'Tag' });

            expect(button.classList.contains('chip')).toBe(true);
        });
    });

    describe('state classes', () => {
        test('applies no state classes by default', () => {
            const button = renderChip({ text: 'Tag' });

            expect(button.classList.contains('active')).toBe(false);
            expect(button.classList.contains('disabled')).toBe(false);
            expect(button.classList.contains('starred')).toBe(false);
        });

        test('applies the active class', () => {
            const button = renderChip({ text: 'Tag', active: true });

            expect(button.classList.contains('active')).toBe(true);
        });

        test('applies the starred class', () => {
            const button = renderChip({ text: 'Tag', starred: true });

            expect(button.classList.contains('starred')).toBe(true);
        });

        test('applies the disabled class and the disabled attribute together', () => {
            const button = renderChip({ text: 'Tag', disabled: true });

            expect(button.classList.contains('disabled')).toBe(true);
            expect(button.disabled).toBe(true);
        });

        test('applies several state classes at once', () => {
            const button = renderChip({ text: 'Tag', active: true, starred: true });

            expect(button.classList.contains('active')).toBe(true);
            expect(button.classList.contains('starred')).toBe(true);
        });
    });

    describe('priority', () => {
        test.each(['low', 'medium', 'high'] as const)('applies the %s priority class', (priority) => {
            const button = renderChip({ text: 'Tag', priority });

            expect(button.classList.contains(priority)).toBe(true);
        });

        test('adds no stray class when priority is omitted', () => {
            const button = renderChip({ text: 'Tag' });

            // Guards against `class="chip {priority}"` rendering the literal
            // string "undefined" when the prop is not supplied.
            expect(button.className).not.toContain('undefined');
            expect(button.className.trim()).toBe('chip');
        });
    });

    describe('click behaviour', () => {
        test('calls clickAction when clicked', () => {
            const clickAction = vi.fn();
            const button = renderChip({ text: 'Tag', clickAction });

            button.click();
            flushSync();

            expect(clickAction).toHaveBeenCalledOnce();
        });

        test('calls clickAction once per click', () => {
            const clickAction = vi.fn();
            const button = renderChip({ text: 'Tag', clickAction });

            button.click();
            button.click();
            button.click();
            flushSync();

            expect(clickAction).toHaveBeenCalledTimes(3);
        });

        test('does not throw when clicked without a clickAction', () => {
            const button = renderChip({ text: 'Tag' });

            expect(() => {
                button.click();
                flushSync();
            }).not.toThrow();
        });

        test('does not call clickAction while disabled', () => {
            const clickAction = vi.fn();
            const button = renderChip({ text: 'Tag', clickAction, disabled: true });

            button.click();
            flushSync();

            expect(clickAction).not.toHaveBeenCalled();
        });

        test('passes no arguments to clickAction', () => {
            const clickAction = vi.fn();
            const button = renderChip({ text: 'Tag', clickAction });

            button.click();
            flushSync();

            expect(clickAction).toHaveBeenCalledWith();
        });
    });
});