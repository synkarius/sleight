import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableComponent } from './VariableComponent';
import { VariableType } from '../../../data/model/variable/variable-types';
import { InjectionContext } from '../../../di/injector-context';
import { TEXT_BOX } from '../../../core/common/accessibility-roles';
import { createSpecItem, Spec } from '../../../data/model/spec/spec-domain';
import { SpecItemType } from '../../../data/model/spec/spec-item-type';
import { saveSpec } from '../../../core/reducers/spec-reducers';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
} from '../../../data/model/variable/variable';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import {
  createSelector,
  createSelectorItem,
  Selector,
  SelectorItem,
} from '../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../core/reducers/selector-reducers';
import { container } from '../../../di/config/brandi-config';
import { Tokens } from '../../../di/config/brandi-tokens';
import { BrowserRouter } from 'react-router-dom';

// optionality:
const SPEC_WITH_VARIABLE_OPTIONAL_ID = 'spec-with-variable-optional-id-1';
const SPEC_WITH_VARIABLE_OPTIONAL_NAME = 'spec-with-variable-optional-name-1';
const SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID =
  'spec-with-variable-not-optional-id-2';
const SPEC_WITH_VARIABLE_NOT_OPTIONAL_NAME =
  'spec-with-variable-not-optional-name-2';
const NON_DEFAULT_VARIABLE_ID = 'non-default-variable-id-1';
const NON_DEFAULT_VARIABLE_NAME = 'non-default-variable-name-1';
const DEFAULT_VARIABLE_ID = 'default-variable-id-2';
const DEFAULT_VARIABLE_NAME = 'default-variable-name-2';
// other
const SAVE = 'Save';
const ADD_NEW_CHOICE_ITEM = 'Add Choice Item';
const GTE1_ERROR_MESSAGE = 'at least one choice item must be added';

let user: UserEvent;

beforeAll(() => {
  const specMapper = container.get(Tokens.DomainMapper_Spec);

  // spec w/ variable; optional
  const specWithVariableOptional: Spec = {
    id: SPEC_WITH_VARIABLE_OPTIONAL_ID,
    name: SPEC_WITH_VARIABLE_OPTIONAL_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: DEFAULT_VARIABLE_ID,
        optional: true,
      },
    ],
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO1 = specMapper.mapFromDomain(specWithVariableOptional);
  store.dispatch(saveSpec(specDTO1));

  // spec w/ variable; not optional
  const specWithVariableNotOptional: Spec = {
    id: SPEC_WITH_VARIABLE_NOT_OPTIONAL_ID,
    name: SPEC_WITH_VARIABLE_NOT_OPTIONAL_NAME,
    items: [
      {
        ...createSpecItem(),
        itemType: SpecItemType.Enum.VARIABLE,
        variableId: NON_DEFAULT_VARIABLE_ID,
        optional: false,
      },
    ],
    roleKey: '',
    enabled: true,
    locked: false,
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariableNotOptional);
  store.dispatch(saveSpec(specDTO2));

  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-saving variables before each test since some tests dirty the data */
  const variableMapper = container.get(Tokens.DomainMapper_Variable);

  // save a selector
  const selectorItem: SelectorItem = {
    ...createSelectorItem(),
    value: 'hi',
  };
  const selector: Selector = { ...createSelector(), items: [selectorItem] };
  store.dispatch(saveSelector(selector));

  // save variables
  // no default
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    id: NON_DEFAULT_VARIABLE_ID,
    name: NON_DEFAULT_VARIABLE_NAME,
    items: [{ ...createChoiceItem(selector) }],
    defaultValue: undefined,
  };
  const choiceVariableDTO = variableMapper.mapFromDomain(choiceVariable);
  store.dispatch(saveVariable(choiceVariableDTO));
  // with default
  const variableWithDefault: ChoiceVariable = {
    ...createChoiceVariable(),
    id: DEFAULT_VARIABLE_ID,
    name: DEFAULT_VARIABLE_NAME,
    items: [{ ...createChoiceItem(selector) }],
    defaultValue: 'asdf',
  };
  const variableWithDefaultDTO =
    variableMapper.mapFromDomain(variableWithDefault);
  store.dispatch(saveVariable(variableWithDefaultDTO));
});

describe('choice variable component tests', () => {
  it('should show error message for choice var with no choice items', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).toBeInTheDocument();
  });

  it('should clear error status when choice items added', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);
    const addChoiceItemButton = screen.getByText(ADD_NEW_CHOICE_ITEM);
    await user.click(addChoiceItemButton);

    expect(errorSpan).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should validate choice var with complete choice item', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const addChoiceItemButton = screen.getByText(ADD_NEW_CHOICE_ITEM);
    await user.click(addChoiceItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.VAR_CHOICE_ITEM_SELECTOR],
    });
    await user.type(selectorInput, 'z');
    await user.tab();

    const errorSpan = screen.queryByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).not.toBeInTheDocument();
    expect(selectorInput).not.toHaveClass('is-invalid');
  });

  it('should invalidate choice var with incomplete choice item', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const addChoiceItemButton = screen.getByText(ADD_NEW_CHOICE_ITEM);
    await user.click(addChoiceItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.VAR_CHOICE_ITEM_SELECTOR],
    });
    await user.click(selectorInput);
    await user.tab();

    expect(selectorInput).toHaveClass('is-invalid');
  });

  it('should invalidate choice var with non-alpha/space selector', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const addChoiceItemButton = screen.getByText(ADD_NEW_CHOICE_ITEM);
    await user.click(addChoiceItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.VAR_CHOICE_ITEM_SELECTOR],
    });
    await user.type(selectorInput, '$');

    expect(selectorInput).toHaveClass('is-invalid');
  });

  it("should show default textbox when 'Use Default' is checked", async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.getByRole(TEXT_BOX, {
      name: Field[Field.VAR_CHOICE_DEFAULT_VALUE],
    });

    expect(defaultInput).toBeVisible();
  });

  it("should hide default textbox when 'Use Default' is unchecked", async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.ENUM);
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.queryByRole(TEXT_BOX, {
      name: Field[Field.VAR_CHOICE_DEFAULT_VALUE],
    });

    expect(defaultInput).not.toBeInTheDocument();
  });

  it('should validate var not default + spec not optional', async () => {
    doRender(NON_DEFAULT_VARIABLE_ID);

    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    const errorText = screen.queryByText(getOptionalityErrorRegex());

    expect(saveButton).not.toBeDisabled();
    expect(useDefaultCheckbox).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should validate var default + spec optional', async () => {
    doRender(DEFAULT_VARIABLE_ID);

    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    const errorText = screen.queryByText(getOptionalityErrorRegex());

    expect(saveButton).not.toBeDisabled();
    expect(useDefaultCheckbox).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should validate var default + spec not optional', async () => {
    // start with non-default variable (used in non-optional spec item)
    doRender(NON_DEFAULT_VARIABLE_ID);

    // change variable to default
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    const errorText = screen.queryByText(getOptionalityErrorRegex());

    expect(saveButton).not.toBeDisabled();
    expect(useDefaultCheckbox).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
  });

  it('should invalidate var no default + spec optional', async () => {
    // start with default variable (used in optional spec item)
    doRender(DEFAULT_VARIABLE_ID);

    // change variable to non-default
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    const errorText = screen.getByText(getOptionalityErrorRegex());

    expect(saveButton).toBeDisabled();
    expect(useDefaultCheckbox).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });
});

const getOptionalityErrorRegex = () =>
  /a default is required because the following specs use this variable in optional variable spec items\: ".+"/;

const doRender = (variableId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <VariableComponent variableId={variableId} />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
};
