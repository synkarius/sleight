import { render, screen, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../App';
import { store } from '../../app/store';
import { ElementType } from '../model/common/element-types';
import { saveAction } from '../model/action/action-reducers';
import { createPauseAction } from '../model/action/pause/pause';
import { saveEditingCommand } from '../model/command/command-reducers';
import { Command, createCommand } from '../model/command/command';
import { Action } from '../model/action/action';
import { Context, createContext } from '../model/context/context';
import { saveEditingContext } from '../model/context/context-reducers';
import { createRoleKey, RoleKey } from '../model/role-key/role-key';
import { saveRoleKey } from '../model/role-key/role-key-reducers';
import { SpecRedux } from '../model/spec/data/spec-redux';
import { saveEditingSpec } from '../model/spec/spec-reducers';
import {
  clearEditingVariable,
  createNewEditingVariable,
  saveEditingVariable,
} from '../model/variable/variable-reducers';
import { createRange } from '../model/variable/range/range';
import { Field } from '../../validation/validation-field';
import { TEXT_BOX } from '../model/common/accessibility-roles';
import { CommandSpecType } from '../model/command/command-spec-type';

let user: UserEvent;

const ACTION_NAME_1 = 'action-name-1';
const COMMAND_NAME_1 = 'command-name-1';
const CONTEXT_NAME_1 = 'context-name-1';
const ROLE_KEY_NAME_1 = 'role-key-name-1';
const SPEC_NAME_1 = 'spec-name-1';
const VARIABLE_NAME_1 = 'variable-name-1';

beforeAll(() => {
  /*
   * Some of this test data is not actually in a saveable state,
   * but it doesn't matter since that's not what's being tested here.
   */
  const action: Action = { ...createPauseAction(), name: ACTION_NAME_1 };
  store.dispatch(saveAction(action));
  const command: Command = { ...createCommand(), name: COMMAND_NAME_1 };
  store.dispatch(saveEditingCommand(command));
  const context: Context = { ...createContext(), name: CONTEXT_NAME_1 };
  store.dispatch(saveEditingContext(context));
  const roleKey: RoleKey = { ...createRoleKey(), value: ROLE_KEY_NAME_1 };
  store.dispatch(saveRoleKey(roleKey));
  const spec: SpecRedux = {
    id: 'asdf',
    name: SPEC_NAME_1,
    roleKeyId: undefined,
    items: [],
  };
  store.dispatch(saveEditingSpec(spec));
  const variable = { ...createRange(), name: VARIABLE_NAME_1 };
  store.dispatch(createNewEditingVariable(variable));
  store.dispatch(saveEditingVariable());
  store.dispatch(clearEditingVariable());
  //
  user = userEvent.setup();
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
    const keyToSendField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.type(keyToSendField, 'b');
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Action',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

    expect(sidebarSavedItem).toBeInTheDocument();
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
    await clickToCreateNew(ElementType.Enum.COMMAND);
    // add a name for display
    const savedName = 'command-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_NAME],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    const specTypeRoleKeyRadio = screen.getByRole('radio', {
      name: CommandSpecType.Enum.ROLE_KEY,
    });
    await user.click(specTypeRoleKeyRadio);
    const roleKeySelect = screen.getByRole('list', {
      name: Field[Field.CMD_SPEC_RK_SELECT],
    });
    await user.selectOptions(roleKeySelect, ROLE_KEY_NAME_1);
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Command',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

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
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Context',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

    expect(sidebarSavedItem).toBeInTheDocument();
  });

  // role key

  it('should handle create new role key ', async () => {
    await clickToCreateNew(ElementType.Enum.ROLE_KEY);

    const header = screen.getByText('Create/Edit Role Key');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.RK_ROLE_KEY],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should handle select role key ', async () => {
    await clickToSelect(ElementType.Enum.ROLE_KEY, ROLE_KEY_NAME_1);

    const header = screen.getByText('Create/Edit Role Key');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.RK_ROLE_KEY],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue(ROLE_KEY_NAME_1);
  });

  it('should handle select and then create new role key ', async () => {
    await clickToSelect(ElementType.Enum.ROLE_KEY, ROLE_KEY_NAME_1);
    const createButton = screen.getByText('Create New Role Key');
    await user.click(createButton);

    const header = screen.getByText('Create/Edit Role Key');
    const nameField = screen.getByRole<HTMLInputElement>(TEXT_BOX, {
      name: Field[Field.RK_ROLE_KEY],
    });

    expect(header).toBeInTheDocument();
    expect(nameField).toBeInTheDocument();
    expect(nameField).toHaveValue('');
  });

  it('should display saved role key', async () => {
    await clickToCreateNew(ElementType.Enum.ROLE_KEY);
    // add a name for display
    const savedName = 'role-key-1';
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.RK_ROLE_KEY],
    });
    await user.type(nameField, savedName);
    // minimal info to save
    // save
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Role Key',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

    expect(sidebarSavedItem).toBeInTheDocument();
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
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Spec',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

    expect(sidebarSavedItem).toBeInTheDocument();
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
    /* Get saved item which is in the same sidebar/accordion group as the "create" button.
     * Slightly violates RTL methodology, but RTL has no "sibling" functionality.
     * It's still "as your user would access it", so still RTL philosophy.
     */
    const createButton = screen.getByRole<HTMLButtonElement>('link', {
      name: 'Create New Variable',
    });
    const section = createButton.parentElement as HTMLElement;
    const sidebarSavedItem = within(section).getByRole('button', {
      name: savedName,
    });

    expect(sidebarSavedItem).toBeInTheDocument();
  });
});
