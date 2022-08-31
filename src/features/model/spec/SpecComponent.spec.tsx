import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { SpecParentComponent } from './SpecParentComponent';
import { createRoleKey, RoleKey } from '../role-key/role-key';
import { saveRoleKey } from '../role-key/role-key-reducers';
import { SpecItemType } from './spec-item-type';
import { saveEditingVariable } from '../variable/variable-reducers';
import { createRangeVariable } from '../variable/data/variable';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { saveEditingSpec } from './spec-reducers';
import { createSpecItem, Spec, SpecItem } from './data/spec-domain';
import { saveSelector } from '../selector/selector-reducers';
import { createPauseAction, PauseAction } from '../action/pause/pause';
import { EnterValueType } from '../action/action-value/action-value';
import { ActionValueType } from '../action/action-value/action-value-type';
import { VariableType } from '../variable/variable-types';
import { saveAction } from '../action/action-reducers';
import { Command, createCommand } from '../command/command';
import { CommandSpecType } from '../command/command-spec-type';
import { saveEditingCommand } from '../command/command-reducers';
import {
  createSelector,
  createSelectorItem,
} from '../selector/data/selector-domain';

let user: UserEvent;

const SPEC_WITH_SELECTOR_ID = 'spec-id-1';
const SPEC_WITH_SELECTOR_NAME = 'spec-name-1';
const SPEC_WITH_VARIABLE_ID = 'spec-id-2';
const SPEC_WITH_VARIABLE_NAME = 'spec-name-2';
const ROLE_KEY_NAME_1 = 'role-key-name-1';
const VARIABLE_ID_1 = 'variable-id-1';
const VARIABLE_NAME_1 = 'variable-name-1';
const SAVE = 'Save';
const ADD_NEW_SPEC_ITEM = 'Add New Spec Item';
const GTE1_ERROR_MESSAGE = 'at least one spec item must be added';

beforeAll(() => {
  const injected = getDefaultInjectionContext();
  const variableMapper = injected.mappers.variable;

  // save role key
  const roleKey: RoleKey = { ...createRoleKey(), value: ROLE_KEY_NAME_1 };
  store.dispatch(saveRoleKey(roleKey));
  // save variable
  const rangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_ID_1,
    name: VARIABLE_NAME_1,
  };
  const rangeVariableDTO = variableMapper.mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));

  // save actions
  const action1: PauseAction = {
    ...createPauseAction(),
    centiseconds: {
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.RANGE,
      variableId: rangeVariable.id,
    },
  };
  store.dispatch(saveAction(action1));
  const action2: PauseAction = {
    ...createPauseAction(),
    centiseconds: {
      actionValueType: ActionValueType.Enum.ENTER_VALUE,
      enteredValueType: EnterValueType.NUMERIC,
      value: 789,
    },
  };
  store.dispatch(saveAction(action2));
  // save commands
  const command1: Command = {
    ...createCommand(),
    specType: CommandSpecType.Enum.SPEC,
    specId: SPEC_WITH_SELECTOR_ID,
    actionIds: [action2.id],
  };
  store.dispatch(saveEditingCommand(command1));
  const command2: Command = {
    ...createCommand(),
    specType: CommandSpecType.Enum.SPEC,
    specId: SPEC_WITH_VARIABLE_ID,
    actionIds: [action1.id],
  };
  store.dispatch(saveEditingCommand(command2));

  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-saving specs before each test since some tests dirty the data */
  const injected = getDefaultInjectionContext();
  const selectorMapper = injected.mappers.selector;
  const specMapper = injected.mappers.spec;

  // save specs
  const selectorSpecItem: SpecItem = {
    ...createSpecItem(),
    itemType: SpecItemType.Enum.SELECTOR,
    selector: {
      ...createSelector(),
      items: [{ ...createSelectorItem(), value: 'asdf' }],
    },
  };
  const specWithSelector: Spec = {
    id: SPEC_WITH_SELECTOR_ID,
    name: SPEC_WITH_SELECTOR_NAME,
    items: [selectorSpecItem],
  };
  const specDTO1 = specMapper.mapFromDomain(specWithSelector);
  store.dispatch(saveEditingSpec(specDTO1));
  const selectorDTO1 = selectorMapper.mapFromDomain(selectorSpecItem.selector);
  store.dispatch(saveSelector(selectorDTO1));
  const specWithVariable: Spec = {
    id: SPEC_WITH_VARIABLE_ID,
    name: SPEC_WITH_VARIABLE_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: VARIABLE_ID_1,
      },
    ],
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariable);
  store.dispatch(saveEditingSpec(specDTO2));
});

const doRender = (specId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <SpecParentComponent specId={specId} />
      </InjectionContext.Provider>
    </Provider>
  );
};

describe('spec component tests', () => {
  it('should have a placeholder name', () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/spe-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    doRender();

    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should show error message spec with no spec items', async () => {
    doRender();

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).toBeInTheDocument();
  });

  it('should clear error status when spec items added', async () => {
    doRender();

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);
    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);

    expect(errorSpan).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate spec with complete spec-type spec item', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    await user.type(selectorInput, 'z');
    await user.tab();

    const errorSpan = screen.queryByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).not.toBeInTheDocument();
    expect(selectorInput).not.toHaveClass('is-invalid');
  });

  it('should invalidate spec with incomplete spec-type spec item', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    await user.click(selectorInput);
    await user.tab();

    expect(selectorInput).toHaveClass('is-invalid');
  });

  it('should validate spec with selected variable-type spec item', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const specTypeSelect = screen.getByRole('list', {
      name: Field[Field.SP_ITEM_TYPE_SELECT],
    });
    await user.selectOptions(specTypeSelect, SpecItemType.Enum.VARIABLE);
    const variableTypeSelect = screen.getByRole('list', {
      name: Field[Field.SP_ITEM_VARIABLE],
    });
    await user.selectOptions(variableTypeSelect, VARIABLE_NAME_1);
    await user.tab();

    const errorSpan = screen.queryByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).not.toBeInTheDocument();
    expect(variableTypeSelect).not.toHaveClass('is-invalid');
  });

  it('should invalidate spec with unselected variable-type spec item', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const specTypeSelect = screen.getByRole('list', {
      name: Field[Field.SP_ITEM_TYPE_SELECT],
    });
    await user.selectOptions(specTypeSelect, SpecItemType.Enum.VARIABLE);
    const variableTypeSelect = screen.getByRole('list', {
      name: Field[Field.SP_ITEM_VARIABLE],
    });
    await user.click(variableTypeSelect);
    await user.tab();

    expect(variableTypeSelect).toHaveClass('is-invalid');
  });

  it('toggle "optional" checkbox should stick', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const optionalCheckbox = screen.getByRole('checkbox', {
      name: 'Optional',
    });
    await user.click(optionalCheckbox);
    const groupedCheckbox = screen.getByRole('checkbox', {
      name: 'Grouped',
    });

    expect(optionalCheckbox).toBeChecked();
    expect(groupedCheckbox).not.toBeDisabled();
  });

  it('false "optional" checkbox toggle should force grouped to false/disabled', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const optionalCheckbox = screen.getByRole('checkbox', {
      name: 'Optional',
    });
    await user.click(optionalCheckbox);
    const groupedCheckbox = screen.getByRole('checkbox', {
      name: 'Grouped',
    });
    await user.click(groupedCheckbox);
    await user.click(optionalCheckbox);

    expect(optionalCheckbox).not.toBeChecked();
    expect(groupedCheckbox).not.toBeChecked();
    expect(groupedCheckbox).toBeDisabled();
  });

  it('toggle "grouped" checkbox should stick', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const optionalCheckbox = screen.getByRole('checkbox', {
      name: 'Optional',
    });
    await user.click(optionalCheckbox);
    const groupedCheckbox = screen.getByRole('checkbox', {
      name: 'Grouped',
    });
    await user.click(groupedCheckbox);

    expect(optionalCheckbox).toBeChecked();
    expect(groupedCheckbox).toBeChecked();
    expect(groupedCheckbox).not.toBeDisabled();
  });

  it('should invalidate an already taken name', async () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, SPEC_WITH_SELECTOR_NAME);

    expect(nameField).toHaveClass('is-invalid');
  });

  it('should invalidate spec with non-alpha/space selector', async () => {
    doRender();

    const addNewSpecItemButton = screen.getByText(ADD_NEW_SPEC_ITEM);
    await user.click(addNewSpecItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    await user.type(selectorInput, '#');

    expect(selectorInput).toHaveClass('is-invalid');
  });

  it('should validate spec w/ no vars used in command w/ actions w/ no vars', async () => {
    doRender(SPEC_WITH_SELECTOR_ID);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate spec w/ vars used in command w/ actions w/ vars', async () => {
    doRender(SPEC_WITH_VARIABLE_ID);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate spec w/ no vars used in command w/ actions w/ vars', async () => {
    doRender(SPEC_WITH_VARIABLE_ID);

    /* attempt to change the spec w/ no vars to a spec w/ vars when spec already used
     * in command w/ vars
     */
    const specItemTypeSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.SP_ITEM_TYPE_SELECT],
    });
    await user.selectOptions(specItemTypeSelect, SpecItemType.Enum.SELECTOR);
    const selectorTextBox = screen.getByRole('textbox', {
      name: Field[Field.SP_ITEM_SELECTOR],
    });
    await user.type(selectorTextBox, 'asdf');
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.getByText(getSpecAdequacyErrorRegex());

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate spec w/ vars used in command w/ actions w/ no vars', async () => {
    doRender(SPEC_WITH_SELECTOR_ID);

    /* change the spec w/ no vars to a spec w/ vars when spec already used
     * in command w/ no vars
     */
    const specItemTypeSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.SP_ITEM_TYPE_SELECT],
    });
    await user.selectOptions(specItemTypeSelect, SpecItemType.Enum.VARIABLE);
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.SP_ITEM_VARIABLE],
    });
    await user.selectOptions(variableSelect, VARIABLE_NAME_1);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this spec is used in the command ".+" in which it/;
