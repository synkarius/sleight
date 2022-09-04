import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { TEXT_BOX } from '../../../common/accessibility-roles';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';
import { createSpecItem, Spec } from '../spec/data/spec-domain';
import { SpecItemType } from '../spec/spec-item-type';
import { saveSpec } from '../spec/spec-reducers';
import { createRangeVariable, RangeVariable } from './data/variable';
import { saveVariable } from './variable-reducers';

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
const SAVE = 'Save';

let user: UserEvent;

beforeAll(() => {
  const injected = getDefaultInjectionContext();
  const specMapper = injected.mappers.spec;

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
  };
  const specDTO2 = specMapper.mapFromDomain(specWithVariableNotOptional);
  store.dispatch(saveSpec(specDTO2));

  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-saving variables before each test since some tests dirty the data */
  const injected = getDefaultInjectionContext();
  const variableMapper = injected.mappers.variable;

  // save variables
  // no default
  const rangeVariable: RangeVariable = {
    ...createRangeVariable(),
    id: NON_DEFAULT_VARIABLE_ID,
    name: NON_DEFAULT_VARIABLE_NAME,
    defaultValue: undefined,
  };
  const rangeVariableDTO = variableMapper.mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));
  // with default
  const variableWithDefault: RangeVariable = {
    ...createRangeVariable(),
    id: DEFAULT_VARIABLE_ID,
    name: DEFAULT_VARIABLE_NAME,
    defaultValue: 234,
  };
  const variableWithDefaultDTO =
    variableMapper.mapFromDomain(variableWithDefault);
  store.dispatch(saveVariable(variableWithDefaultDTO));
});

describe('text variable component tests', () => {
  it("should show default textbox when 'Use Default' is checked", async () => {
    doRender();

    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.getByRole(TEXT_BOX, {
      name: Field[Field.VAR_TEXT_DEFAULT_VALUE],
    });

    expect(defaultInput).toBeVisible();
  });

  it("should hide default textbox when 'Use Default' is unchecked", async () => {
    doRender();

    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.queryByRole(TEXT_BOX, {
      name: Field[Field.VAR_TEXT_DEFAULT_VALUE],
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
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <VariableParentComponent variableId={variableId} />
      </InjectionContext.Provider>
    </Provider>
  );
};
