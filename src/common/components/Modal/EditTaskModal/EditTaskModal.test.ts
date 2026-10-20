import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import EditTaskModal from './EditTaskModal.svelte';
import { type Task } from '../../../types/types';
import { appState, appStateV2 } from '../../../../state/appState.svelte';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
import { invoke } from '@tauri-apps/api/core';

let component: ReturnType<typeof mount> | undefined;
let triggerUpdateTask: ReturnType<typeof vi.spyOn>;

const EXISTING: Task = {
    id: 'task-1',
    name: 'Write tests',
    estimatedhours: 4,
    priority: 'medium'
} as unknown as Task;

function renderModal() {
    component = mount(EditTaskModal, { target: document.body, props: {} });
    flushSync();
}

/** Mount with the modal already open for a task, and let getTask settle. */
async function openForTask(task: Partial<Task> = {}) {
    appState.editTaskInfo = {
        isEditTaskModalOpen: true,
        taskId: 'task-1'
    };
    vi.mocked(invoke).mockImplementation(async (cmd: string) => {
        if (cmd === 'get_task') return { ...EXISTING, ...task };
        return undefined;
    });

    renderModal();

    await vi.waitFor(() => {
        flushSync();
        expect(nameInput().value).not.toBe('');
    });
    flushSync();
}

function dialog() {
    return document.querySelector<HTMLDialogElement>('dialog.modal-container')!;
}

function nameInput() {
    return document.querySelector<HTMLInputElement>('#projectname')!;
}

function estimateInput() {
    return document.querySelector<HTMLInputElement>('#projectdeadline')!;
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

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(invoke).mockResolvedValue(undefined as never);
    triggerUpdateTask = vi.spyOn(appStateV2, 'triggerUpdateTask').mockImplementation(() => {});

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close'));
    });

    appState.editTaskInfo = {
        isEditTaskModalOpen: false,
        taskId: undefined
    };
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
    vi.restoreAllMocks();
});

describe('EditTaskModal', () => {
    describe('markup', () => {
        test('renders the dialog and its title', () => {
            renderModal();

            expect(dialog()).not.toBeNull();
            expect(document.querySelector('.modal-title')?.textContent).toBe('Update Task');
        });

        test('renders the name and estimate inputs', () => {
            renderModal();

            expect(nameInput().type).toBe('text');
            expect(estimateInput().type).toBe('number');
        });

        test('renders a chip per priority', () => {
            renderModal();

            expect(() => buttonLabelled('Low')).not.toThrow();
            expect(() => buttonLabelled('Medium')).not.toThrow();
            expect(() => buttonLabelled('High')).not.toThrow();
        });

        test('renders Update and Cancel buttons', () => {
            renderModal();

            expect(() => buttonLabelled('Update')).not.toThrow();
            expect(() => buttonLabelled('Cancel')).not.toThrow();
        });

        test('shows no warning by default', () => {
            renderModal();

            expect(document.querySelector('.modal-warning')).toBeNull();
        });
    });

    describe('opening', () => {
        test('stays closed while isEditTaskModalOpen is false', () => {
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
            expect(invoke).not.toHaveBeenCalled();
        });

        test('stays closed when there is no taskId', () => {
            appState.editTaskInfo = { isEditTaskModalOpen: true, taskId: undefined };
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
            expect(invoke).not.toHaveBeenCalled();
        });

        test('opens and loads the task when opened for a task', async () => {
            await openForTask();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
            expect(invoke).toHaveBeenCalledWith('get_task', { taskId: 'task-1' });
        });
    });

    describe('prefilling the form', () => {
        test('fills the name from the loaded task', async () => {
            await openForTask();

            expect(nameInput().value).toBe('Write tests');
        });

        test('fills the estimate from the loaded task', async () => {
            await openForTask({ estimatedhours: 7 } as Partial<Task>);

            expect(estimateInput().value).toBe('7');
        });

        test('marks the loaded priority chip active', async () => {
            await openForTask({ priority: 'high' } as Partial<Task>);

            expect(buttonLabelled('High').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
        });
    });

    describe('the Update button', () => {
        test('is disabled while nothing has changed', async () => {
            await openForTask();

            expect(buttonLabelled('Update').disabled).toBe(true);
        });

        test('enables once the name changes', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('enables once the estimate changes', async () => {
            await openForTask();

            typeInto(estimateInput(), '9');

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('enables once the priority changes', async () => {
            await openForTask({ priority: 'medium' } as Partial<Task>);

            buttonLabelled('High').click();
            flushSync();

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('disables again when the name is changed back', async () => {
            await openForTask();

            typeInto(nameInput(), 'Something else');
            expect(buttonLabelled('Update').disabled).toBe(false);

            typeInto(nameInput(), 'Write tests');

            expect(buttonLabelled('Update').disabled).toBe(true);
        });
    });

    describe('editing the form', () => {
        test('selecting a priority chip marks it active and clears the others', async () => {
            await openForTask({ priority: 'medium' } as Partial<Task>);

            buttonLabelled('Low').click();
            flushSync();

            expect(buttonLabelled('Low').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Medium').classList.contains('active')).toBe(false);
        });
    });

    describe('submitting', () => {
        test('invokes update_task with the edited values', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');
            typeInto(estimateInput(), '9');
            buttonLabelled('High').click();
            flushSync();

            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('update_task', {
                    taskId: 'task-1',
                    newName: 'Write more tests',
                    newEstimate: 9,
                    newPriority: 'high'
                });
            });
        });

        test('notifies the task subscribers', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(triggerUpdateTask).toHaveBeenCalledOnce();
            });
        });

        test('clears the edit info and closes', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(appState.editTaskInfo.isEditTaskModalOpen).toBe(false);
            });
            expect(appState.editTaskInfo.taskId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

        test('resets the form fields', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                flushSync();
                expect(nameInput().value).toBe('');
            });
            expect(estimateInput().value).toBe('');
        });
    });

    describe('cancelling', () => {
        test('does not invoke update_task', async () => {
            await openForTask();

            typeInto(nameInput(), 'Write more tests');
            buttonLabelled('Cancel').click();
            flushSync();

            expect(invoke).not.toHaveBeenCalledWith('update_task', expect.anything());
        });

        test('does not notify task subscribers', async () => {
            await openForTask();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(triggerUpdateTask).not.toHaveBeenCalled();
        });

        test('clears the edit info and closes', async () => {
            await openForTask();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.editTaskInfo.isEditTaskModalOpen).toBe(false);
            expect(appState.editTaskInfo.taskId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });
    });

    describe('dismissing via the close event', () => {
        test('clears the edit info when the dialog closes itself (Esc)', async () => {
            await openForTask();

            dialog().open = true;
            dialog().close();
            flushSync();

            expect(appState.editTaskInfo.isEditTaskModalOpen).toBe(false);
            expect(appState.editTaskInfo.taskId).toBeUndefined();
            expect(invoke).not.toHaveBeenCalledWith('update_task', expect.anything());
        });
    });
});