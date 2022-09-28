import { act, render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { SpecParentComponent } from './SpecParentComponent';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import { InjectionContext } from '../../../di/injector-context';
import { deleteSpec, saveSpec } from '../../../core/reducers/spec-reducers';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import { saveAction } from '../../../core/reducers/action-reducers';
import { saveCommand } from '../../../core/reducers/command-reducers';
import { action01 } from '../../../test/resources/action-01.json';
import { action02 } from '../../../test/resources/action-02.json';
import { command01 } from '../../../test/resources/command-01.json';
import { command02 } from '../../../test/resources/command-02.json';
import { selector01 } from '../../../test/resources/selector-01.json';
import { spec01 } from '../../../test/resources/spec-01.json';
import { spec02 } from '../../../test/resources/spec-02.json';
import { spec03 } from '../../../test/resources/spec-03.json';
import { spec04 } from '../../../test/resources/spec-04.json';
import { variable01 } from '../../../test/resources/variable-01.json';
import { variable02 } from '../../../test/resources/variable-02.json';
import { castJsonForTest } from '../../../test/utils/import-test-json-util';
import { container } from '../../../di/config/brandi-config';

let specIdsForCleanup: string[];

// spec adequacy:
const SPEC_WITH_SELECTOR_ID = 'spec-with-selector-id-1';
const SPEC_WITH_SELECTOR_NAME = 'spec-with-selector-name-1';
const SPEC_WITH_VARIABLE_ID = 'spec-with-variable-id-2';
// optionality:
const SPEC_WITH_VARIABLE_OPTIONAL_ID = 'spec-with-variable-optional-id-3';
const SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID =
  'spec-with-variable-not-optional-id-4';
// mixed
const ROLE_KEY = 'role-key';
const VARIABLE_NAME_1 = 'non-default-variable-name-1';
const DEFAULT_VARIABLE_NAME_2 = 'default-variable-name-2';

// RTL
const SAVE = 'Save';
const ADD_NEW_SPEC_ITEM = 'Add New Spec Item';
const GTE1_ERROR_MESSAGE = 'at least one spec item must be added';
let user: UserEvent;

beforeAll(() => {
  // save variables
  // no default
  store.dispatch(saveVariable(castJsonForTest(variable01)));
  // with default
  store.dispatch(saveVariable(castJsonForTest(variable02)));
  // save actions
  store.dispatch(saveAction(castJsonForTest(action01)));
  store.dispatch(saveAction(castJsonForTest(action02)));
  // save commands
  store.dispatch(saveCommand(castJsonForTest(command01)));
  store.dispatch(saveCommand(castJsonForTest(command02)));

  user = userEvent.setup();
});

beforeEach(() => {
  specIdsForCleanup = [];
});

afterEach(() => {
  for (const specId of specIdsForCleanup) {
    store.dispatch(deleteSpec(specId));
  }
});

const doRender = (specId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec01)));
      specIdsForCleanup.push(spec01.id);
      store.dispatch(saveSelector(castJsonForTest(selector01)));
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec01)));
      specIdsForCleanup.push(spec01.id);
      store.dispatch(saveSelector(castJsonForTest(selector01)));
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec01)));
      specIdsForCleanup.push(spec01.id);
      store.dispatch(saveSelector(castJsonForTest(selector01)));
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec02)));
      specIdsForCleanup.push(spec02.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec02)));
      specIdsForCleanup.push(spec02.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec01)));
      specIdsForCleanup.push(spec01.id);
      store.dispatch(saveSelector(castJsonForTest(selector01)));
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec03)));
      specIdsForCleanup.push(spec03.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec04)));
      specIdsForCleanup.push(spec04.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec03)));
      specIdsForCleanup.push(spec03.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec04)));
      specIdsForCleanup.push(spec04.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec03)));
      specIdsForCleanup.push(spec03.id);
    });
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
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec04)));
      specIdsForCleanup.push(spec04.id);
    });
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

  it('should invalidate duplicate spec', async () => {
    act(() => {
      store.dispatch(saveSpec(castJsonForTest(spec02)));
      specIdsForCleanup.push(spec02.id);
    });
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
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);

    const errorText = screen.getByText(getSpecUniquenessErrorRegex());

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });
});

const getSpecAdequacyErrorRegex = () =>
  /this spec is used in the command ".+" in which it/;

const getOptionalityErrorRegex = () =>
  /optional variable spec items require variables with defaults/;

const getSpecUniquenessErrorRegex = () =>
  /specs must be unique; this spec is duplicated by: ".+"/;
