import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import NewProjectModal from './NewProjectModal.svelte';
import { COLOR_VALUES } from '../../../types/types';
import { appState } from '../../../../state/appState.svelte';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
import { invoke } from '@tauri-apps/api/core';

let component: ReturnType<typeof mount> | undefined;

function renderModal(isNewProjectModalOpen = false) {
    component = mount(NewProjectModal, {
        target: document.body,
        props: { isNewProjectModalOpen }
    });
    flushSync();
}

function dialog() {
    return document.querySelector<HTMLDialogElement>('dialog.modal-container')!;
}

function nameInput() {
    return document.querySelector<HTMLInputElement>('#projectname')!;
}

function deadlineInput() {
    return document.querySelector<HTMLInputElement>('#projectdeadline')!;
}

function swatches() {
    return [...document.querySelectorAll<HTMLButtonElement>('.swatch')];
}

function buttonLabelled(label: string) {
    const match = [...document.querySelectorAll('button')].find(
        (b) => b.textContent?.trim() === label
    );
    if (!match) throw new Error(`No button labelled "${label}"`);
    return match as HTMLButtonElement;
}

function typeInto(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
}

/** Open the modal and fill every field in. */
function fillForm({
                      name = 'New Project',
                      deadline = '2027-03-01',
                      priority = 'High',
                      colorIndex = 1
                  } = {}) {
    typeInto(nameInput(), name);
    typeInto(deadlineInput(), deadline);
    buttonLabelled(priority).click();
    flushSync();
    swatches()[colorIndex].click();
    flushSync();
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(invoke).mockResolvedValue([] as never);

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close'));
    });

    appState.triggerUpdateProjectsList = 0;
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

describe('NewProjectModal', () => {
    describe('markup', () => {
        test('renders the dialog and its title', () => {
            renderModal();

            expect(dialog()).not.toBeNull();
            expect(document.querySelector('.modal-title')?.textContent).toBe('New Project');
        });

        test('renders the name and deadline inputs', () => {
            renderModal();

            expect(nameInput().type).toBe('text');
            expect(deadlineInput().type).toBe('date');
        });

        test('renders a chip per priority', () => {
            renderModal();

            expect(() => buttonLabelled('Low')).not.toThrow();
            expect(() => buttonLabelled('Medium')).not.toThrow();
            expect(() => buttonLabelled('High')).not.toThrow();
        });

        test('renders a swatch per colour', () => {
            renderModal();

            expect(swatches()).toHaveLength(COLOR_VALUES.length);
        });

        test('renders Create and Cancel buttons', () => {
            renderModal();

            expect(() => buttonLabelled('Create')).not.toThrow();
            expect(() => buttonLabelled('Cancel')).not.toThrow();
        });

        test('starts with an empty form', () => {
            renderModal();

            expect(nameInput().value).toBe('');
            expect(deadlineInput().value).toBe('');
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
            expect(swatches().some((s) => s.classList.contains('selected'))).toBe(false);
        });
    });

    describe('opening', () => {
        test('stays closed when isNewProjectModalOpen is false', () => {
            renderModal(false);

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
        });

        test('opens when isNewProjectModalOpen is true', () => {
            renderModal(true);

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });
    });

    describe('editing the form', () => {
        test('selecting a priority chip marks it active and clears the others', () => {
            renderModal(true);

            buttonLabelled('Medium').click();
            flushSync();

            expect(buttonLabelled('Medium').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
            expect(buttonLabelled('High').classList.contains('active')).toBe(false);
        });

        test('selecting a swatch marks exactly one as selected', () => {
            renderModal(true);

            swatches()[2].click();
            flushSync();

            expect(swatches()[2].classList.contains('selected')).toBe(true);
            expect(swatches().filter((s) => s.classList.contains('selected'))).toHaveLength(1);
        });

        test('selecting a different swatch moves the selection', () => {
            renderModal(true);

            swatches()[2].click();
            flushSync();
            swatches()[4].click();
            flushSync();

            expect(swatches()[4].classList.contains('selected')).toBe(true);
            expect(swatches()[2].classList.contains('selected')).toBe(false);
        });
    });

    describe('creating', () => {
        test('invokes create_project with the entered values', async () => {
            renderModal(true);
            fillForm({ name: 'Stratum v2', deadline: '2027-03-01', priority: 'High', colorIndex: 1 });

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('create_project', {
                    projectName: 'Stratum v2',
                    color: COLOR_VALUES[1],
                    deadline: '2027-03-01',
                    priority: 'high'
                });
            });
        });

        test('bumps triggerUpdateProjectsList', async () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(appState.triggerUpdateProjectsList).toBe(1);
            });
        });

        test('closes the dialog', async () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
            });
        });

        test('resets the form', async () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                flushSync();
                expect(nameInput().value).toBe('');
            });
            expect(deadlineInput().value).toBe('');
            expect(buttonLabelled('High').classList.contains('active')).toBe(false);
            expect(swatches().some((s) => s.classList.contains('selected'))).toBe(false);
        });
    });

    describe('cancelling', () => {
        test('does not create anything', () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(invoke).not.toHaveBeenCalled();
        });

        test('does not bump triggerUpdateProjectsList', () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.triggerUpdateProjectsList).toBe(0);
        });

        test('closes the dialog and resets the form', () => {
            renderModal(true);
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
            expect(nameInput().value).toBe('');
            expect(deadlineInput().value).toBe('');
            expect(swatches().some((s) => s.classList.contains('selected'))).toBe(false);
        });
    });

    describe('dismissing via the close event', () => {
        test('resets the form when the dialog closes itself (Esc)', () => {
            renderModal(true);
            fillForm();

            dialog().open = true;
            dialog().close();
            flushSync();

            expect(nameInput().value).toBe('');
            expect(invoke).not.toHaveBeenCalled();
        });
    });
});