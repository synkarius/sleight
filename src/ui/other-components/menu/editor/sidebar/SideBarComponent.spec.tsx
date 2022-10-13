import { render, screen, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../../../App';
import { store } from '../../../../../app/store';
import { ElementType } from '../../../../../data/model/element-types';
import {
  deleteAction,
  saveAction,
} from '../../../../../core/reducers/action-reducers';
import { createPauseAction } from '../../../../../data/model/action/pause/pause';
import {
  deleteCommand,
  saveCommand,
} from '../../../../../core/reducers/command-reducers';
import { Command } from '../../../../../data/model/command/command';
import {
  Context,
  createContext,
} from '../../../../../data/model/context/context';
import { saveContext } from '../../../../../core/reducers/context-reducers';
import { SpecDTO } from '../../../../../data/model/spec/spec-dto';
import { saveSpec } from '../../../../../core/reducers/spec-reducers';
import { saveVariable } from '../../../../../core/reducers/variable-reducers';
import { Field } from '../../../../../validation/validation-field';
import { TEXT_BOX } from '../../../../../core/common/accessibility-roles';
import {
  createRangeVariable,
  RangeVariable,
} from '../../../../../data/model/variable/variable';
import { Action } from '../../../../../data/model/action/action';
import { act } from 'react-dom/test-utils';
import { VariableType } from '../../../../../data/model/variable/variable-types';
import { ActionValueType } from '../../../../../data/model/action/action-value-type';

let user: UserEvent;

const ACTION_ID_1 = 'action-id-1';
const ACTION_NAME_1 = 'pause-action-name-1';
const COMMAND_ID_1 = 'command-id-1';
const COMMAND_NAME_1 = 'command-name-1';
const CONTEXT_ID_1 = 'context-id-1';
const CONTEXT_NAME_1 = 'context-name-1';
const SPEC_ID_1 = 'spec-id-1';
const SPEC_NAME_1 = 'spec-name-1';
const VARIABLE_ID_1 = 'variable-id-1';
const VARIABLE_NAME_1 = 'variable-name-1';

const getSpecDeletionErrorRegex = () =>
  /cannot delete: this spec is used in command\(s\): ".+"/;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(() => {
  /*
   * Some of this test data is not actually in a saveable state,
   * but it doesn't matter since that's not what's being tested here.
   *
   * Re-saving before each test since some tests dirty the data.
   */
  const action: Action = {
    ...createPauseAction(),
    id: ACTION_ID_1,
    name: ACTION_NAME_1,
    centiseconds: {
      id: '123',
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.NUMBER,
      variableId: VARIABLE_ID_1,
    },
  };
  store.dispatch(saveAction(action));
  const context: Context = {
    ...createContext(),
    id: CONTEXT_ID_1,
    name: CONTEXT_NAME_1,
  };
  store.dispatch(saveContext(context));
  const spec: SpecDTO = {
    id: SPEC_ID_1,
    name: SPEC_NAME_1,
    roleKey: '',
    enabled: true,
    locked: false,
    items: [],
  };
  store.dispatch(saveSpec(spec));
  const command: Command = {
    id: COMMAND_ID_1,
    name: COMMAND_NAME_1,
    roleKey: '',
    enabled: true,
    locked: false,
    specId: SPEC_ID_1,
    actionIds: [ACTION_ID_1],
    contextId: CONTEXT_ID_1,
  };
  store.dispatch(saveCommand(command));
  const variable: RangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_ID_1,
    name: VARIABLE_NAME_1,
  };
  store.dispatch(saveVariable(variable));
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

const SAVE = 'Save';

const clickToCreateNew = async (type: ElementType.Type): Promise<void> => {
  const sidebarSection = screen.getByText<HTMLButtonElement>(`${type}s`);
  await user.click(sidebarSection);
  const createButton = screen.getByText(`Create New ${type}`);
  await user.click(createButton);
};

const clickToSelect = async (
  type: ElementType.Type,
  elementName: string
): Promise<void> => {
  const sidebarSection = screen.getByText<HTMLButtonElement>(`${type}s`);
  await user.click(sidebarSection);
  const selectButton = screen.getByRole('button', { name: elementName });
  await user.click(selectButton);
};

/**
 * Test that creating and selecting all of the element types works.
 */
describe('side bar component tests', () => {
  it('should start with nothing open', () => {
    const header = screen.queryByText('Create');

    expect(header).not.toBeInTheDocument();
  });

  // action

  it('should handle create new action ', async () => {
    await clickToCreateNew(ElementType.Enum.ACTION);

    const header = screen.getByText('Create/Edit Action');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.AC_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select action ', async () => {
    await clickToSelect(ElementType.Enum.ACTION, ACTION_NAME_1);

    const header = screen.getByText('Create/Edit Action');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.AC_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(ACTION_NAME_1);
  });

  it('should handle select and then create new action ', async () => {
    await clickToSelect(ElementType.Enum.ACTION, ACTION_NAME_1);
    const createButton = screen.getByText('Create New Action');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Action');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.AC_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved action', async () => {
    await clickToCreateNew(ElementType.Enum.ACTION);
    // add a name for display
    const savedName = 'action-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    const keyToSendField = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.AC_SK_KEY_TO_SEND_VALUE],
    });
    await user.selectOptions(keyToSendField, 'b (bravo)');
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    const sidebarSavedItem = getElementSelectButton(
      ElementType.Enum.ACTION,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete action w/ confirm', async () => {
    // can't delete action if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.ACTION, ACTION_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE_MODAL_DELETE],
    });
    await user.click(deleteConfirmButton);

    const header = screen.queryByText('Create/Edit Action');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.ACTION,
      ACTION_NAME_1
    );

    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete action w/ cancel', async () => {
    // can't delete action if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.ACTION, ACTION_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE],
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE_MODAL_CANCEL],
    });
    await user.click(deleteCancelButton);

    const header = screen.queryByText('Create/Edit Action');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.ACTION,
      ACTION_NAME_1
    );

    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete action validation', async () => {
    // can't delete action if still attached to a command
    await clickToSelect(ElementType.Enum.ACTION, ACTION_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.AC_DELETE_MODAL_DELETE],
    });

    const errorText = screen.getByText(
      `cannot delete: this action is used in command(s): "${COMMAND_NAME_1}"`
    );

    expect(deleteConfirmButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  // command

  it('should handle create new command ', async () => {
    await clickToCreateNew(ElementType.Enum.COMMAND);

    const header = screen.getByText('Create/Edit Command');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CMD_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select command ', async () => {
    await clickToSelect(ElementType.Enum.COMMAND, COMMAND_NAME_1);

    const header = screen.getByText('Create/Edit Command');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CMD_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(COMMAND_NAME_1);
  });

  it('should handle select and then create new command ', async () => {
    await clickToSelect(ElementType.Enum.COMMAND, COMMAND_NAME_1);
    const createButton = screen.getByText('Create New Command');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Command');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CMD_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved command', async () => {
    /** create a spec just for this test b/c reusing SPEC_ID_1 here
     * causes other tests to fail */
    const specName = 'spec-id-1391872317';
    const spec: SpecDTO = {
      id: 'spec-name-123412341987',
      name: specName,
      roleKey: '',
      enabled: true,
      locked: false,
      items: [],
    };
    act(() => {
      store.dispatch(saveSpec(spec));
    });
    //
    await clickToCreateNew(ElementType.Enum.COMMAND);
    // add a name for display
    const savedName = 'command-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    const specSelect = screen.getByRole('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    await user.selectOptions(specSelect, specName);
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    const sidebarSavedItem = getElementSelectButton(
      ElementType.Enum.COMMAND,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete command w/ confirm', async () => {
    // delete
    await clickToSelect(ElementType.Enum.COMMAND, COMMAND_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.CMD_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.CMD_DELETE_MODAL_DELETE],
    });
    await user.click(deleteConfirmButton);

    const header = screen.queryByText('Create/Edit Command');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.COMMAND,
      COMMAND_NAME_1
    );

    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete command w/ cancel', async () => {
    // delete
    await clickToSelect(ElementType.Enum.COMMAND, COMMAND_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.CMD_DELETE],
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: Field[Field.CMD_DELETE_MODAL_CANCEL],
    });
    await user.click(deleteCancelButton);

    const header = screen.queryByText('Create/Edit Command');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.COMMAND,
      COMMAND_NAME_1
    );

    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  // context

  it('should handle create new context ', async () => {
    await clickToCreateNew(ElementType.Enum.CONTEXT);

    const header = screen.getByText('Create/Edit Context');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CTX_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select context ', async () => {
    await clickToSelect(ElementType.Enum.CONTEXT, CONTEXT_NAME_1);

    const header = screen.getByText('Create/Edit Context');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CTX_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(CONTEXT_NAME_1);
  });

  it('should handle select and then create new context ', async () => {
    await clickToSelect(ElementType.Enum.CONTEXT, CONTEXT_NAME_1);
    const createButton = screen.getByText('Create New Context');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Context');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.CTX_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved context', async () => {
    await clickToCreateNew(ElementType.Enum.CONTEXT);
    // add a name for display
    const savedName = 'context-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    const matcherField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_MATCHER],
    });
    await user.type(matcherField, 'c');
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    const sidebarSavedItem = getElementSelectButton(
      ElementType.Enum.CONTEXT,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete context w/ confirm', async () => {
    // can't delete context if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.CONTEXT, CONTEXT_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE_MODAL_DELETE],
    });
    await user.click(deleteConfirmButton);

    const header = screen.queryByText('Create/Edit Context');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.CONTEXT,
      CONTEXT_NAME_1
    );

    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete context w/ cancel', async () => {
    // can't delete context if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.CONTEXT, CONTEXT_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE],
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE_MODAL_CANCEL],
    });
    await user.click(deleteCancelButton);

    const header = screen.queryByText('Create/Edit Context');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.CONTEXT,
      CONTEXT_NAME_1
    );

    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete context validation', async () => {
    // can't delete context if still attached to a command
    await clickToSelect(ElementType.Enum.CONTEXT, CONTEXT_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.CTX_DELETE_MODAL_DELETE],
    });

    const errorText = screen.getByText(
      `cannot delete: this context is used in command(s): "${COMMAND_NAME_1}"`
    );

    expect(deleteConfirmButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  // spec

  it('should handle create new spec ', async () => {
    await clickToCreateNew(ElementType.Enum.SPEC);

    const header = screen.getByText('Create/Edit Spec');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.SP_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select spec ', async () => {
    await clickToSelect(ElementType.Enum.SPEC, SPEC_NAME_1);

    const header = screen.getByText('Create/Edit Spec');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.SP_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(SPEC_NAME_1);
  });

  it('should handle select and then create new spec ', async () => {
    await clickToSelect(ElementType.Enum.SPEC, SPEC_NAME_1);
    const createButton = screen.getByText('Create New Spec');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Spec');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.SP_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved spec', async () => {
    await clickToCreateNew(ElementType.Enum.SPEC);
    // add a name for display
    const savedName = 'spec-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    const addNewButton = screen.getByRole<HTMLButtonElement>('button', {
      name: Field[Field.SP_ADD_ITEM_BUTTON],
    });
    await user.click(addNewButton);
    const selectorItemField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    await user.type(selectorItemField, 'f');
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    const sidebarSavedItem = getElementSelectButton(
      ElementType.Enum.SPEC,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete spec w/ confirm', async () => {
    // can't delete spec if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.SPEC, SPEC_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE_MODAL_DELETE],
    });
    await user.click(deleteConfirmButton);

    const header = screen.queryByText('Create/Edit Spec');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.SPEC,
      SPEC_NAME_1
    );

    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete spec w/ cancel', async () => {
    // can't delete spec if still attached to a command
    act(() => {
      store.dispatch(deleteCommand(COMMAND_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.SPEC, SPEC_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE],
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE_MODAL_CANCEL],
    });
    await user.click(deleteCancelButton);

    const header = screen.queryByText('Create/Edit Spec');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.SPEC,
      SPEC_NAME_1
    );

    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete spec validation', async () => {
    // can't delete spec if still attached to a command
    await clickToSelect(ElementType.Enum.SPEC, SPEC_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.SP_DELETE_MODAL_DELETE],
    });

    const errorText = screen.getByText(getSpecDeletionErrorRegex());

    expect(deleteConfirmButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });

  // variable

  it('should handle create new variable', async () => {
    await clickToCreateNew(ElementType.Enum.VARIABLE);

    const header = screen.getByText('Create/Edit Variable');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.VAR_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select variable', async () => {
    await clickToSelect(ElementType.Enum.VARIABLE, VARIABLE_NAME_1);

    const header = screen.getByText('Create/Edit Variable');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.VAR_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(VARIABLE_NAME_1);
  });

  it('should handle select and then create new variable', async () => {
    await clickToSelect(ElementType.Enum.VARIABLE, VARIABLE_NAME_1);
    const createButton = screen.getByText('Create New Variable');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Variable');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.VAR_NAME],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved variable', async () => {
    await clickToCreateNew(ElementType.Enum.VARIABLE);
    // add a name for display
    const savedName = 'variable-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    const sidebarSavedItem = getElementSelectButton(
      ElementType.Enum.VARIABLE,
      savedName
    );

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete variable w/ confirm', async () => {
    // can't delete variable if still attached to an action
    act(() => {
      store.dispatch(deleteAction(ACTION_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.VARIABLE, VARIABLE_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE_MODAL_DELETE],
    });
    await user.click(deleteConfirmButton);

    const header = screen.queryByText('Create/Edit Variable');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.VARIABLE,
      VARIABLE_NAME_1
    );

    expect(header).not.toBeInTheDocument();
    expect(sidebarSavedItem).not.toBeInTheDocument();
  });

  it('should handle delete variable w/ cancel', async () => {
    // can't delete variable if still attached to an action
    act(() => {
      store.dispatch(deleteAction(ACTION_ID_1));
    });
    // delete
    await clickToSelect(ElementType.Enum.VARIABLE, VARIABLE_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE],
    });
    await user.click(deleteButton);
    const deleteCancelButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE_MODAL_CANCEL],
    });
    await user.click(deleteCancelButton);

    const header = screen.queryByText('Create/Edit Variable');
    const sidebarSavedItem = queryElementSelectButton(
      ElementType.Enum.VARIABLE,
      VARIABLE_NAME_1
    );

    expect(header).toBeInTheDocument();
    expect(sidebarSavedItem).toBeInTheDocument();
  });

  it('should handle delete variable validation', async () => {
    // can't delete variable if still attached to an action
    await clickToSelect(ElementType.Enum.VARIABLE, VARIABLE_NAME_1);
    const deleteButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE],
    });
    await user.click(deleteButton);
    const deleteConfirmButton = screen.getByRole('button', {
      name: Field[Field.VAR_DELETE_MODAL_DELETE],
    });

    const errorText = screen.getByText(
      `cannot delete: this variable is used in action(s): "${ACTION_NAME_1}"`
    );

    expect(deleteConfirmButton).toBeDisabled();
    expect(errorText).toBeInTheDocument();
  });
});

/** Get saved item which is in the same sidebar/accordion group as the "create" button.
 * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
 * It's still "as your user would access it", so still RTL philosophy kind of.
 *
 * TODO: do this better, but the RTL way, if there is one
 */
const getElementSelectButton = (
  elementType: ElementType.Type,
  savedName: string
): HTMLElement => {
  const createButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Create New ' + elementType,
  });
  const section = createButton.parentElement as HTMLElement;
  const sidebarSavedItem = within(section).getByRole('button', {
    name: savedName,
  });
  return sidebarSavedItem;
};
/** see notes on `getElementSelectButton`: also applicable here */
const queryElementSelectButton = (
  elementType: ElementType.Type,
  savedName: string
) => {
  const createButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Create New ' + elementType,
  });
  const section = createButton.parentElement as HTMLElement;
  const sidebarSavedItem = within(section).queryByRole('button', {
    name: savedName,
  });
  return sidebarSavedItem;
};
