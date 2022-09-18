import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { SpecParentComponent } from './SpecParentComponent';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import {
  createRangeVariable,
  RangeVariable,
} from '../../../data/model/variable/variable';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';
import { saveSpec } from '../../../core/reducers/spec-reducers';
import {
  createSpecItem,
  Spec,
  SpecItem,
} from '../../../data/model/spec/spec-domain';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import {
  createPauseAction,
  PauseAction,
} from '../../../data/model/action/pause/pause';
import { ActionValueType } from '../../../data/model/action/action-value-type';
import { VariableType } from '../../../data/model/variable/variable-types';
import { saveAction } from '../../../core/reducers/action-reducers';
import { Command, createCommand } from '../../../data/model/command/command';
import { saveCommand } from '../../../core/reducers/command-reducers';
import {
  createSelector,
  createSelectorItem,
} from '../../../data/model/selector/selector-domain';

let user: UserEvent;
// spec adequacy:
const SPEC_WITH_SELECTOR_ID = 'spec-with-selector-id-1';
const SPEC_WITH_SELECTOR_NAME = 'spec-with-selector-name-1';
const SPEC_WITH_VARIABLE_ID = 'spec-with-variable-id-2';
const SPEC_WITH_VARIABLE_NAME = 'spec-with-variable-name-2';
// optionality:
const SPEC_WITH_VARIABLE_OPTIONAL_ID = 'spec-with-variable-optional-id-3';
const SPEC_WITH_VARIABLE_OPTIONAL_NAME = 'spec-with-variable-optional-name-3';
const SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID =
  'spec-with-variable-not-optional-id-4';
const SPEC_WITH_VARIABLE_NOT_OPTIONAL_NAME =
  'spec-with-variable-not-optional-name-4';
// mixed
const ROLE_KEY = 'role-key';
const VARIABLE_ID_1 = 'non-default-variable-id-1';
const VARIABLE_NAME_1 = 'non-default-variable-name-1';
const DEFAULT_VARIABLE_ID_2 = 'default-variable-id-2';
const DEFAULT_VARIABLE_NAME_2 = 'default-variable-name-2';
const SAVE = 'Save';
const ADD_NEW_SPEC_ITEM = 'Add New Spec Item';
const GTE1_ERROR_MESSAGE = 'at least one spec item must be added';

beforeAll(() => {
  const injected = getDefaultInjectionContext();
  const variableMapper = injected.mappers.variable;

  // save variables
  // no default
  const rangeVariable1: RangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_ID_1,
    name: VARIABLE_NAME_1,
    defaultValue: undefined,
  };
  const rangeVariableDTO1 = variableMapper.mapFromDomain(rangeVariable1);
  store.dispatch(saveVariable(rangeVariableDTO1));
  // with default
  const variableWithDefault: RangeVariable = {
    ...createRangeVariable(),
    id: DEFAULT_VARIABLE_ID_2,
    name: DEFAULT_VARIABLE_NAME_2,
    defaultValue: 234,
  };
  const variableWithDefaultDTO =
    variableMapper.mapFromDomain(variableWithDefault);
  store.dispatch(saveVariable(variableWithDefaultDTO));

  // save actions
  const action1: PauseAction = {
    ...createPauseAction(),
    centiseconds: {
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableType: VariableType.Enum.NUMBER,
      variableId: rangeVariable1.id,
    },
  };
  store.dispatch(saveAction(action1));
  const action2: PauseAction = {
    ...createPauseAction(),
    centiseconds: {
      actionValueType: ActionValueType.Enum.ENTER_VALUE,
      enteredValueType: VariableType.Enum.NUMBER,
      value: 789,
    },
  };
  store.dispatch(saveAction(action2));
  // save commands
  const command1: Command = {
    ...createCommand(),
    specId: SPEC_WITH_SELECTOR_ID,
    actionIds: [action2.id],
  };
  store.dispatch(saveCommand(command1));
  const command2: Command = {
    ...createCommand(),
    specId: SPEC_WITH_VARIABLE_ID,
    actionIds: [action1.id],
  };
  store.dispatch(saveCommand(command2));

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
    roleKey: ROLE_KEY,
    enabled: true,
    locked: false,
  };
  const specDTO1 = specMapper.mapFromDomain(specWithSelector);
  store.dispatch(saveSpec(specDTO1));
  const selectorDTO1 = selectorMapper.mapFromDomain(selectorSpecItem.selector);
  store.dispatch(saveSelector(selectorDTO1));

  // spec w/ variable
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
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariable);
  store.dispatch(saveSpec(specDTO2));

  // spec w/ variable; optional
  const specWithVariableOptional: Spec = {
    id: SPEC_WITH_VARIABLE_OPTIONAL_ID,
    name: SPEC_WITH_VARIABLE_OPTIONAL_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: DEFAULT_VARIABLE_ID_2,
        optional: true,
      },
    ],
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO3 = specMapper.mapFromDomain(specWithVariableOptional);
  store.dispatch(saveSpec(specDTO3));

  // spec w/ variable; not optional
  const specWithVariableNotOptional: Spec = {
    id: SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID,
    name: SPEC_WITH_VARIABLE_NOT_OPTIONAL_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: VARIABLE_ID_1,
        optional: false,
      },
    ],
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO4 = specMapper.mapFromDomain(specWithVariableNotOptional);
  store.dispatch(saveSpec(specDTO4));
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

    const errorText = screen.getByText('a spec already exists with this name');
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken role key', async () => {
    doRender();

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.SP_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, ROLE_KEY);

    const errorText = screen.getByText(
      'a spec already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
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

  it('should validate spec optional + var default', async () => {
    doRender(SPEC_WITH_VARIABLE_OPTIONAL_ID);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate spec not optional + var not default', async () => {
    doRender(SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.queryByText(getSpecAdequacyErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate spec optional + var not default, via var select', async () => {
    // start with optional spec + default var
    doRender(SPEC_WITH_VARIABLE_OPTIONAL_ID);

    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.SP_ITEM_VARIABLE],
    });
    // change to non-default var
    await user.selectOptions(variableSelect, VARIABLE_NAME_1);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    const errorText = screen.getByText(getOptionalityErrorRegex());

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should validate spec not optional + var default, via var select', async () => {
    // start with non-optional spec with non-default var
    doRender(SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID);

    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.SP_ITEM_VARIABLE],
    });
    // change to default var
    await user.selectOptions(variableSelect, [DEFAULT_VARIABLE_NAME_2]);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    const errorText = screen.queryByText(getOptionalityErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate spec not optional + var default, via optional switch', async () => {
    // start with optional spec + default var
    doRender(SPEC_WITH_VARIABLE_OPTIONAL_ID);

    const optionalSwitch = screen.getByLabelText('Optional');
    // change to non-optional spec
    await user.click(optionalSwitch);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    const errorText = screen.queryByText(getOptionalityErrorRegex());

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate spec optional + var not default, via optional switch', async () => {
    // start with non-optional spec with non-default var
    doRender(SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID);

    const optionalSwitch = screen.getByLabelText('Optional');
    // change to optional spec
    await user.click(optionalSwitch);

    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    const errorText = screen.getByText(getOptionalityErrorRegex());

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should update enabled', async () => {
    doRender();

    const enabledSwitch = screen.getByLabelText('Enabled');
    expect(enabledSwitch).toBeChecked();
    await user.click(enabledSwitch);

    expect(enabledSwitch).not.toBeChecked();
  });

  it('should update locked', async () => {
    doRender();

    const lockedSwitch = screen.getByLabelText('Locked');
    expect(lockedSwitch).not.toBeChecked();
    await user.click(lockedSwitch);

    expect(lockedSwitch).toBeChecked();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this spec is used in the command ".+" in which it/;

const getOptionalityErrorRegex = () =>
  /optional variable spec items require variables with defaults/;
