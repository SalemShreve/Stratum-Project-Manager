import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import Icon from './Icon.svelte';
import StubIcon from '../../../test/StubIcon.svelte';
import type { IconEnum, SizeEnum } from '../../types/types';

// Mock only getIcon; the rest of the module (types, other helpers) stays real.
vi.mock('../../types/types', async (importOriginal) => {
    const actual = await importOriginal<typeof import('../../types/types')>();
    return { ...actual, getIcon: vi.fn() };
});
import { getIcon } from '../../types/types';

let component: ReturnType<typeof mount> | undefined;

type IconProps = {
    kind: 'normal' | 'toggle' | 'destroy' | 'transparent';
    icon: IconEnum;
    size: SizeEnum;
    title?: string;
    testId?: string;
};

function renderIcon(props: Partial<IconProps> = {}) {
    const full: IconProps = {
        kind: 'normal',
        icon: 'home' as IconEnum,
        size: 'medium' as SizeEnum,
        ...props
    };
    component = mount(Icon, { target: document.body, props: full });
    flushSync();
    return document.querySelector<HTMLDivElement>('div.custom-icon')!;
}

function container() {
    return document.querySelector<HTMLDivElement>('div.custom-icon')!;
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

describe('Icon', () => {
    describe('container markup', () => {
        test('applies the base, kind and size classes', () => {
            const el = renderIcon({ kind: 'destroy', size: 'large' as SizeEnum });

            expect(el.classList.contains('custom-icon')).toBe(true);
            expect(el.classList.contains('destroy')).toBe(true);
            expect(el.classList.contains('large')).toBe(true);
        });

        test.each(['normal', 'toggle', 'destroy', 'transparent'] as const)(
            'applies the %s kind class',
            (kind) => {
                const el = renderIcon({ kind });

                expect(el.classList.contains(kind)).toBe(true);
            }
        );

        test('sets the title attribute when given', () => {
            const el = renderIcon({ title: 'Delete task' });

            expect(el.getAttribute('title')).toBe('Delete task');
        });

        test('omits the title attribute when not given', () => {
            const el = renderIcon();

            expect(el.hasAttribute('title')).toBe(false);
        });

        test('sets data-testid when given', () => {
            const el = renderIcon({ testId: 'delete-btn-icon' });

            expect(el.getAttribute('data-testid')).toBe('delete-btn-icon');
        });

        test('omits data-testid when not given', () => {
            const el = renderIcon();

            expect(el.hasAttribute('data-testid')).toBe(false);
        });
    });

    describe('icon loading', () => {
        test('requests the icon for the given size and name', async () => {
            renderIcon({ icon: 'trash' as IconEnum, size: 'small' as SizeEnum });

            await vi.waitFor(() => {
                expect(getIcon).toHaveBeenCalledWith('small', 'trash');
            });
        });

        test('renders nothing inside the container before the icon resolves', () => {
            let resolve!: (c: unknown) => void;
            vi.mocked(getIcon).mockReturnValue(new Promise((r) => (resolve = r)) as never);

            const el = renderIcon();

            expect(el.querySelector('[data-testid="stub-icon"]')).toBeNull();
            resolve(StubIcon);
        });

        test('renders the icon component once it resolves', async () => {
            renderIcon();

            await vi.waitFor(() => {
                flushSync();
                expect(container().querySelector('[data-testid="stub-icon"]')).not.toBeNull();
            });
        });

        test('renders nothing when the icon name is unknown', async () => {
            vi.mocked(getIcon).mockResolvedValue(undefined as never);

            const el = renderIcon({ icon: 'not-a-real-icon' as IconEnum });

            await vi.waitFor(() => {
                flushSync();
                expect(el.children).toHaveLength(0);
            });
        });
    });
});