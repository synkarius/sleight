import { render, screen, within } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../App';
import { store } from '../../app/store';
import { ElementType } from '../../common/element-types';
import { saveAction } from '../model/action/action-reducers';
import { createPauseAction } from '../model/action/pause/pause';
import { saveCommand } from '../model/command/command-reducers';
import { Command, createCommand } from '../model/command/command';
import { Context, createContext } from '../model/context/context';
import { saveContext } from '../model/context/context-reducers';
import { SpecDTO } from '../model/spec/data/spec-dto';
import { saveSpec } from '../model/spec/spec-reducers';
import { saveVariable } from '../model/variable/variable-reducers';
import { Field } from '../../validation/validation-field';
import { TEXT_BOX } from '../../common/accessibility-roles';
import { createRangeVariable } from '../model/variable/data/variable';
import { Action } from '../model/action/action';

let user: UserEvent;

const ACTION_NAME_1 = 'pause-action-name-1';
const COMMAND_NAME_1 = 'command-name-1';
const CONTEXT_NAME_1 = 'context-name-1';
const SPEC_NAME_1 = 'spec-name-1';
const VARIABLE_NAME_1 = 'variable-name-1';

beforeAll(() => {
  /*
   * Some of this test data is not actually in a saveable state,
   * but it doesn't matter since that's not what's being tested here.
   */
  const action: Action = {
    ...createPauseAction(),
    name: ACTION_NAME_1,
  };
  store.dispatch(saveAction(action));
  const context: Context = { ...createContext(), name: CONTEXT_NAME_1 };
  store.dispatch(saveContext(context));
  const spec: SpecDTO = {
    id: 'asdf',
    name: SPEC_NAME_1,
    roleKey: '',
    items: [],
  };
  const command: Command = {
    ...createCommand(),
    name: COMMAND_NAME_1,
    specId: spec.id,
  };
  store.dispatch(saveCommand(command));
  store.dispatch(saveSpec(spec));
  const variable = { ...createRangeVariable(), name: VARIABLE_NAME_1 };
  store.dispatch(saveVariable(variable));
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
    const keyToSendField = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.selectOptions(keyToSendField, 'b (bravo)');
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
    const specSelect = screen.getByRole('list', {
      name: Field[Field.CMD_SPEC_SELECT],
    });
    await user.selectOptions(specSelect, SPEC_NAME_1);
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
