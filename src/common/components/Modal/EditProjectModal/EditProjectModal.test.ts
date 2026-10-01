import { expect, test, beforeEach, afterEach, describe, vi } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import EditProjectModal from './EditProjectModal.svelte';
import { COLOR_VALUES, type Project } from '../../../types/types';
import { appState } from '../../../../state/appState.svelte';

vi.mock('@tauri-apps/api/core', () => ({
    invoke: vi.fn()
}));
import { invoke } from '@tauri-apps/api/core';

let component: ReturnType<typeof mount> | undefined;

const EXISTING: Project = {
    id: 'proj-1',
    name: 'Stratum',
    deadline: '2026-12-31',
    priority: 'medium',
    color: COLOR_VALUES[0]
} as unknown as Project;

function renderModal() {
    component = mount(EditProjectModal, { target: document.body, props: {} });
    flushSync();
}

/** Mount with the modal already open for a project, and let getProject settle. */
async function openForProject(project: Partial<Project> = {}) {
    appState.editNodeInfo = {
        isEditModalOpen: true,
        nodeId: 'proj-1',
        nodeType: 'project'
    };
    vi.mocked(invoke).mockImplementation(async (cmd: string) => {
        if (cmd === 'get_project') return { ...EXISTING, ...project };
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

/** Type into a bound input the way Svelte expects. */
function typeInto(input: HTMLInputElement, value: string) {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();
}

beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(invoke).mockResolvedValue(undefined as never);

    HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
        this.open = true;
    });
    HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
        if (!this.open) return;
        this.open = false;
        this.dispatchEvent(new Event('close'));
    });

    appState.editNodeInfo = {
        isEditModalOpen: false,
        nodeId: undefined,
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

describe('EditProjectModal', () => {
    describe('markup', () => {
        test('renders the dialog and its title', () => {
            renderModal();

            expect(dialog()).not.toBeNull();
            expect(document.querySelector('.modal-title')?.textContent).toBe('Update Project');
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
        test('stays closed while isEditModalOpen is false', () => {
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
            expect(invoke).not.toHaveBeenCalled();
        });

        test('stays closed when the node being edited is a task', () => {
            appState.editNodeInfo = {
                isEditModalOpen: true,
                nodeId: 'task-1',
                nodeType: 'task'
            };
            renderModal();

            expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
            expect(invoke).not.toHaveBeenCalled();
        });

        test('opens and loads the project when opened for a project', async () => {
            await openForProject();

            expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
            expect(invoke).toHaveBeenCalledWith('get_project', { projectId: 'proj-1' });
        });

        test('does not load anything when nodeId is missing', () => {
            appState.editNodeInfo = {
                isEditModalOpen: true,
                nodeId: undefined,
                nodeType: 'project'
            };
            renderModal();

            expect(invoke).not.toHaveBeenCalled();
        });
    });

    describe('prefilling the form', () => {
        test('fills the name from the loaded project', async () => {
            await openForProject();

            expect(nameInput().value).toBe('Stratum');
        });

        test('fills the deadline from the loaded project', async () => {
            await openForProject();

            expect(deadlineInput().value).toBe('2026-12-31');
        });

        test('marks the loaded priority chip active', async () => {
            await openForProject({ priority: 'high' } as Partial<Project>);

            expect(buttonLabelled('High').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Low').classList.contains('active')).toBe(false);
        });

        test('marks the loaded colour swatch selected', async () => {
            await openForProject({ color: COLOR_VALUES[2] } as Partial<Project>);

            expect(swatches()[2].classList.contains('selected')).toBe(true);
            expect(swatches().filter((s) => s.classList.contains('selected'))).toHaveLength(1);
        });
    });

    describe('the Update button', () => {
        test('is disabled while nothing has changed', async () => {
            await openForProject();

            expect(buttonLabelled('Update').disabled).toBe(true);
        });

        test('enables once the name changes', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('enables once the deadline changes', async () => {
            await openForProject();

            typeInto(deadlineInput(), '2027-01-15');

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('enables once the priority changes', async () => {
            await openForProject({ priority: 'medium' } as Partial<Project>);

            buttonLabelled('High').click();
            flushSync();

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('enables once the colour changes', async () => {
            await openForProject({ color: COLOR_VALUES[0] } as Partial<Project>);

            swatches()[1].click();
            flushSync();

            expect(buttonLabelled('Update').disabled).toBe(false);
        });

        test('disables again when the name is changed back', async () => {
            await openForProject();

            typeInto(nameInput(), 'Something else');
            expect(buttonLabelled('Update').disabled).toBe(false);

            typeInto(nameInput(), 'Stratum');

            expect(buttonLabelled('Update').disabled).toBe(true);
        });
    });

    describe('editing the form', () => {
        test('selecting a priority chip marks it active and clears the others', async () => {
            await openForProject({ priority: 'medium' } as Partial<Project>);

            buttonLabelled('Low').click();
            flushSync();

            expect(buttonLabelled('Low').classList.contains('active')).toBe(true);
            expect(buttonLabelled('Medium').classList.contains('active')).toBe(false);
        });

        test('selecting a swatch moves the selection', async () => {
            await openForProject({ color: COLOR_VALUES[0] } as Partial<Project>);

            swatches()[3].click();
            flushSync();

            expect(swatches()[3].classList.contains('selected')).toBe(true);
            expect(swatches()[0].classList.contains('selected')).toBe(false);
        });
    });

    describe('submitting', () => {
        test('invokes update_project with the edited values', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');
            typeInto(deadlineInput(), '2027-01-15');
            buttonLabelled('High').click();
            flushSync();
            swatches()[1].click();
            flushSync();

            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(invoke).toHaveBeenCalledWith('update_project', {
                    projectId: 'proj-1',
                    newName: 'Stratum v2',
                    newColor: COLOR_VALUES[1],
                    newDeadline: '2027-01-15',
                    newPriority: 'high'
                });
            });
        });

        test('clears the edit info and closes', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(appState.editNodeInfo.isEditModalOpen).toBe(false);
            });
            expect(appState.editNodeInfo.nodeId).toBeUndefined();
            expect(appState.editNodeInfo.nodeType).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

        test('bumps triggerUpdateProjectsList', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                expect(appState.triggerUpdateProjectsList).toBeGreaterThan(0);
            });
        });

        test('resets the form fields', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');
            buttonLabelled('Update').click();

            await vi.waitFor(() => {
                flushSync();
                expect(nameInput().value).toBe('');
            });
            expect(deadlineInput().value).toBe('');
        });
    });

    describe('cancelling', () => {
        test('does not invoke update_project', async () => {
            await openForProject();

            typeInto(nameInput(), 'Stratum v2');
            buttonLabelled('Cancel').click();
            flushSync();

            expect(invoke).not.toHaveBeenCalledWith('update_project', expect.anything());
        });

        test('clears the edit info and closes', async () => {
            await openForProject();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.editNodeInfo.isEditModalOpen).toBe(false);
            expect(appState.editNodeInfo.nodeId).toBeUndefined();
            expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        });

        // Unlike the delete modal, handleClose always bumps the counter — so a
        // cancel refreshes the project list too.
        test('still bumps triggerUpdateProjectsList', async () => {
            await openForProject();

            buttonLabelled('Cancel').click();
            flushSync();

            expect(appState.triggerUpdateProjectsList).toBeGreaterThan(0);
        });
    });

    describe('dismissing via the close event', () => {
        test('clears the edit info when the dialog closes itself (Esc)', async () => {
            await openForProject();

            dialog().open = true;
            dialog().close();
            flushSync();

            expect(appState.editNodeInfo.isEditModalOpen).toBe(false);
            expect(appState.editNodeInfo.nodeId).toBeUndefined();
            expect(invoke).not.toHaveBeenCalledWith('update_project', expect.anything());
        });
    });
});