import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import NewTaskModal from './NewTaskModal.svelte';
import { appState } from '../../../../state/appState.svelte';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
import { invoke } from '@tauri-apps/api/core';

let component: ReturnType<typeof mount> | undefined;

function renderModal() {
    component = mount(NewTaskModal, { target: document.body, props: {} });
    flushSync();
}

/** Mount with the modal already open under the given parent. */
function openUnder(parent: {
    parentId?: string;
    parentProjectId?: string;
    parentTaskId?: string;
} = {}) {
    appState.newTaskInfo = {
        isNewTaskModalOpen: true,
        parentId: 'proj-1',
        parentProjectId: 'proj-1',
        parentTaskId: undefined,
        ...parent
    };
    renderModal();
}

function dialog() {
    return document.querySelector<HTMLDialogElement>('dialog.modal-container')!;
}

function nameInput() {
    return document.querySelector<HTMLInputElement>('#taskname')!;
}

function estimateInput() {
    return document.querySelector<HTMLInputElement>('#taskest')!;
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

function fillForm({ name = 'New task', estimate = '3', priority = 'High' } = {}) {
    typeInto(nameInput(), name);
    typeInto(estimateInput(), estimate);
    buttonLabelled(priority).click();
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

    appState.newTaskInfo = {
        isNewTaskModalOpen: false,
        parentId: undefined,
        parentProjectId: undefined,
        parentTaskId: undefined
    };
    appState.triggerUpdateProjectsList = 0;
    appState.triggerTaskCardStateCheck = 0;
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

describe('NewTaskModal', () => {
    describe('markup', () => {
        test('renders the dialog and its title', () => {
            renderModal();

            expect(dialog()).not.toBeNull();
            expect(document.querySelector('.modal-title')?.textContent).toBe('New Task');
        });

        test('renders the name and estimate inputs', () => {
            renderModal();

            expect(nameInput().type).toBe('text');
            expect(estimateInput().type).toBe('number');
        });

        test('stops the estimate going negative', () => {
            renderModal();

            expect(estimateInput().getAttribute('min')).toBe('0');
        });

        test('renders a chip per priority', () => {
            renderModal();

            expect(() => buttonLabelled('Low')).not.toThrow();
            expect(() => buttonLabelled('Medium')).not.toThrow();
            expect(() => buttonLabelled('High')).not.toThrow();
        });

        test('renders Create and Cancel buttons', () => {
            renderModal();

            expect(() => buttonLabelled('Create')).not.toThrow();
            expect(() => buttonLabelled('Cancel')).not.toThrow();
        });

        test('starts with an empty form', () => {
            renderModal();

            expect(nameInput().value).toBe('');
            expect(estimateInput().value).toBe('');
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
            expect(buttonLabelled('Medium').classList.contains('active')).toBe(false);
            expect(buttonLabelled('High').classList.contains('active')).toBe(false);
        });
    });

    describe('opening', () => {
        test('stays closed while isNewTaskModalOpen is false', () => {
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
        });

        test('opens when isNewTaskModalOpen is true at mount', () => {
            openUnder();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });

        test('opens when isNewTaskModalOpen flips to true', () => {
            renderModal();
            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

            appState.newTaskInfo.isNewTaskModalOpen = true;
            flushSync();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });
    });

    describe('editing the form', () => {
        test('selecting a priority chip marks it active and clears the others', () => {
            openUnder();

            buttonLabelled('Medium').click();
            flushSync();

            expect(buttonLabelled('Medium').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
            expect(buttonLabelled('High').classList.contains('active')).toBe(false);
        });

        test('switching priority moves the active chip', () => {
            openUnder();

            buttonLabelled('Low').click();
            flushSync();
            buttonLabelled('High').click();
            flushSync();

            expect(buttonLabelled('High').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
        });
    });

    describe('creating', () => {
        test('invokes create_task with the entered values and the parent ids', async () => {
            openUnder({ parentId: 'proj-1', parentProjectId: 'proj-1', parentTaskId: undefined });
            fillForm({ name: 'Write the docs', estimate: '5', priority: 'High' });

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('create_task', {
                    parentId: 'proj-1',
                    parentProjectId: 'proj-1',
                    parentTaskId: undefined,
                    taskName: 'Write the docs',
                    estimatedHours: 5,
                    priority: 'high'
                });
            });
        });

        test('passes the parent task id when nesting under a task', async () => {
            openUnder({ parentId: 'task-7', parentProjectId: 'proj-1', parentTaskId: 'task-7' });
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith(
                    'create_task',
                    expect.objectContaining({ parentTaskId: 'task-7', parentProjectId: 'proj-1' })
                );
            });
        });

        test('bumps triggerUpdateProjectsList', async () => {
            openUnder();
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(appState.triggerUpdateProjectsList).toBe(1);
            });
        });

        test('bumps triggerTaskCardStateCheck', async () => {
            openUnder();
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(appState.triggerTaskCardStateCheck).toBe(1);
            });
        });

        test('clears the parent info and closes', async () => {
            openUnder();
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(appState.newTaskInfo.isNewTaskModalOpen).toBe(false);
            });
            expect(appState.newTaskInfo.parentId).toBeUndefined();
            expect(appState.newTaskInfo.parentProjectId).toBeUndefined();
            expect(appState.newTaskInfo.parentTaskId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

        test('resets the form', async () => {
            openUnder();
            fillForm();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                flushSync();
                expect(nameInput().value).toBe('');
            });
            expect(estimateInput().value).toBe('');
            expect(buttonLabelled('High').classList.contains('active')).toBe(false);
        });

        // There is no validation, so a blank form still reaches the backend.
        test('submits even when the form is entirely empty', async () => {
            openUnder();

            buttonLabelled('Create').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith(
                    'create_task',
                    expect.objectContaining({
                        taskName: undefined,
                        estimatedHours: undefined,
                        priority: undefined
                    })
                );
            });
        });
    });

    describe('cancelling', () => {
        test('does not create anything', () => {
            openUnder();
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(invoke).not.toHaveBeenCalled();
        });

        test('does not bump triggerUpdateProjectsList', () => {
            openUnder();
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.triggerUpdateProjectsList).toBe(0);
        });

        // handleClose always bumps this one, so cancelling still re-checks the cards.
        test('still bumps triggerTaskCardStateCheck', () => {
            openUnder();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.triggerTaskCardStateCheck).toBe(1);
        });

        test('clears the parent info, closes and resets the form', () => {
            openUnder();
            fillForm();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.newTaskInfo.isNewTaskModalOpen).toBe(false);
            expect(appState.newTaskInfo.parentId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
            expect(nameInput().value).toBe('');
            expect(estimateInput().value).toBe('');
        });
    });

    describe('dismissing via the close event', () => {
        test('clears the parent info when the dialog closes itself (Esc)', () => {
            openUnder();
            fillForm();

            dialog().open = true;
            dialog().close();
            flushSync();

            expect(appState.newTaskInfo.isNewTaskModalOpen).toBe(false);
            expect(appState.newTaskInfo.parentId).toBeUndefined();
            expect(nameInput().value).toBe('');
            expect(invoke).not.toHaveBeenCalled();
        });
    });
});