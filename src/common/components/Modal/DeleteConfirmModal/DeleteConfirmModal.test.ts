import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import DeleteConfirmModal from './DeleteConfirmModal.svelte';
import { appState } from '../../../../state/appState.svelte';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
import { invoke } from '@tauri-apps/api/core';

let component: ReturnType<typeof mount> | undefined;

type ModalProps = { selectedTaskId?: string | undefined };

function renderModal(props: ModalProps = {}) {
    component = mount(DeleteConfirmModal, { target: document.body, props: { ...props } });
    flushSync();
}

function dialog() {
    return document.querySelector<HTMLDialogElement>('dialog.modal-container')!;
}

/** TextButton's internal markup isn't our concern here — find by visible label. */
function buttonLabelled(label: string) {
    const match = [...document.querySelectorAll('button')].find(
        (b) => b.textContent?.trim() === label
    );
    if (!match) throw new Error(`No button labelled "${label}"`);
    return match;
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(invoke).mockResolvedValue([]);

    // jsdom's <dialog> support is uneven; drive it ourselves so the tests
    // assert our component's behaviour rather than jsdom's.
    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close'));
    });

    appState.deleteNodeInfo = {
        isDeleteConfirmModalOpen: false,
        nodeId: undefined,
        nodeName: undefined,
        nodeType: undefined
    };
    appState.triggerUpdateProjectsList = 0;
});

afterEach(() => {
    if (component) {
        unmount(component);
        component = undefined;
    }
    document.body.innerHTML = '';
});

describe('DeleteConfirmModal', () => {
    describe('rendering', () => {
        test('renders the dialog with its title', () => {
            renderModal();

            expect(dialog()).not.toBeNull();
            expect(document.querySelector('.modal-title')?.textContent).toBe('Confirm Deletion');
        });

        test('names the node being deleted in the body copy', () => {
            appState.deleteNodeInfo.nodeName = 'Backend work';
            renderModal();

            expect(document.querySelector('.modal-content')?.textContent).toContain('Backend work');
        });

        test('renders Delete and Cancel buttons', () => {
            renderModal();

            expect(() => buttonLabelled('Delete')).not.toThrow();
            expect(() => buttonLabelled('Cancel')).not.toThrow();
        });
    });

    describe('opening', () => {
        test('does not open while isDeleteConfirmModalOpen is false', () => {
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
        });

        test('opens when isDeleteConfirmModalOpen is already true at mount', () => {
            appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });

        test('opens when isDeleteConfirmModalOpen flips to true', () => {
            renderModal();
            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();

            appState.deleteNodeInfo.isDeleteConfirmModalOpen = true;
            flushSync();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        });
    });

    describe('deleting a project', () => {
        beforeEach(() => {
            appState.deleteNodeInfo = {
                isDeleteConfirmModalOpen: true,
                nodeId: 'proj-1',
                nodeName: 'Stratum',
                nodeType: 'project'
            };
        });

        test('invokes delete_project with the node id', async () => {
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('delete_project', { projectId: 'proj-1' });
            });
            expect(invoke).toHaveBeenCalledOnce();
        });

        test('bumps triggerUpdateProjectsList', async () => {
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(appState.triggerUpdateProjectsList).toBe(1);
            });
        });

        test('clears the delete info and closes the dialog', async () => {
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(appState.deleteNodeInfo.isDeleteConfirmModalOpen).toBe(false);
            });
            expect(appState.deleteNodeInfo.nodeId).toBeUndefined();
            expect(appState.deleteNodeInfo.nodeName).toBeUndefined();
            expect(appState.deleteNodeInfo.nodeType).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

        test('deletes normally while a task is selected', async () => {
            renderModal({ selectedTaskId: 'task-9' });

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('delete_project', { projectId: 'proj-1' });
            });
        });
    });

    describe('deleting a task', () => {
        beforeEach(() => {
            appState.deleteNodeInfo = {
                isDeleteConfirmModalOpen: true,
                nodeId: 'task-1',
                nodeName: 'Write tests',
                nodeType: 'task'
            };
        });

        test('invokes delete_task with the node id', async () => {
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('delete_task', { taskId: 'task-1' });
            });
        });

        test('still deletes when the selected task is the one being deleted', async () => {
            renderModal({ selectedTaskId: 'task-1' });

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('delete_task', { taskId: 'task-1' });
            });
        });

        test('still deletes when a different task is selected', async () => {
            renderModal({ selectedTaskId: 'task-other' });

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('delete_task', { taskId: 'task-1' });
            });
        });

        test('does not blow up when selectedTaskId is undefined', async () => {
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => expect(invoke).toHaveBeenCalled());
        });
    });

    describe('unknown node type', () => {
        test('invokes nothing but still closes', async () => {
            appState.deleteNodeInfo = {
                isDeleteConfirmModalOpen: true,
                nodeId: 'x',
                nodeName: 'x',
                nodeType: undefined
            };
            renderModal();

            buttonLabelled('Delete').click();

            await vi.waitFor(() => {
                expect(appState.deleteNodeInfo.isDeleteConfirmModalOpen).toBe(false);
            });
            expect(invoke).not.toHaveBeenCalled();
        });
    });

    describe('cancelling', () => {
        beforeEach(() => {
            appState.deleteNodeInfo = {
                isDeleteConfirmModalOpen: true,
                nodeId: 'task-1',
                nodeName: 'Write tests',
                nodeType: 'task'
            };
        });

        test('deletes nothing', () => {
            renderModal();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(invoke).not.toHaveBeenCalled();
        });

        test('does not bump triggerUpdateProjectsList', () => {
            renderModal();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.triggerUpdateProjectsList).toBe(0);
        });

        test('clears the delete info and closes the dialog', () => {
            renderModal();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.deleteNodeInfo.isDeleteConfirmModalOpen).toBe(false);
            expect(appState.deleteNodeInfo.nodeId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

    });

    describe('dismissing via the close event', () => {
        test('clears the delete info when the dialog is closed externally (Esc)', () => {
            appState.deleteNodeInfo = {
                isDeleteConfirmModalOpen: true,
                nodeId: 'task-1',
                nodeName: 'Write tests',
                nodeType: 'task'
            };
            renderModal();

            // What pressing Esc amounts to: the dialog closes itself.
            dialog().open = true;
            dialog().close();
            flushSync();

            expect(appState.deleteNodeInfo.isDeleteConfirmModalOpen).toBe(false);
            expect(appState.deleteNodeInfo.nodeId).toBeUndefined();
            expect(invoke).not.toHaveBeenCalled();
        });
    });
});