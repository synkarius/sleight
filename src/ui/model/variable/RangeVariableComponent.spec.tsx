import { fireEvent, render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableComponent } from './VariableComponent';
import { VariableType } from '../../../data/model/variable/variable-types';
import { NUMBER_TEXT_BOX } from '../../../core/common/accessibility-roles';
import { InjectionContext } from '../../../di/injector-context';
import { container } from '../../../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';
import { fieldName } from '../../../validation/field-name';
import { loadTestData } from '../../../test/utils/import-test-json-util';
import { import12 } from '../../../test/resources/import-12.json';
import { import13 } from '../../../test/resources/import-13.json';
import { import14 } from '../../../test/resources/import-14.json';

// optionality:
const NON_DEFAULT_VARIABLE_ID = 'e54f6949-cbb2-4cfb-a3df-be6cf6d7af71';
const DEFAULT_VARIABLE_ID = '5e6db954-85a1-442d-ae5a-8fbf4ff6c8cb';
const SAVE = 'Save';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  /* re-saving variables before each test since some tests dirty the data */
  loadTestData(import12);
});

describe('range variable component tests', () => {
  it('should validate range var with max GTE min', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: fieldName(Field.VAR_TYPE_SELECT),
    });
    await user.selectOptions(typeSelect, VariableType.Enum.NUMBER);
    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MIN),
    });
    const maxInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MAX),
    });
    await user.clear(minInput);
    await user.clear(maxInput);
    await user.click(maxInput);
    await user.type(maxInput, '99');
    await user.tab();

    expect(maxInput).not.toHaveClass('is-invalid');
  });

  it('should invalidate range var with max LT min', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: fieldName(Field.VAR_TYPE_SELECT),
    });
    await user.selectOptions(typeSelect, VariableType.Enum.NUMBER);
    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MIN),
    });
    const maxInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MAX),
    });
    await user.clear(minInput);
    await user.clear(maxInput);
    await user.click(minInput);
    await user.type(minInput, '99');
    await user.click(maxInput);
    await user.tab();

    expect(maxInput).toHaveClass('is-invalid');
  });

  it("should show default number input when 'Use Default' is checked", async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: fieldName(Field.VAR_TYPE_SELECT),
    });
    await user.selectOptions(typeSelect, VariableType.Enum.NUMBER);
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_DEFAULT_VALUE),
    });

    expect(defaultInput).toBeVisible();
  });

  it("should hide default number input when 'Use Default' is unchecked", async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: fieldName(Field.VAR_TYPE_SELECT),
    });
    await user.selectOptions(typeSelect, VariableType.Enum.NUMBER);
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.queryByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_DEFAULT_VALUE),
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

  it('should invalidate used range var having its range changed to become inappropriate for its use', async () => {
    loadTestData(import14);
    doRender(import14.variables[0].id);

    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MIN),
    });
    // user.type() seems not to work for negative numbers
    fireEvent.change(minInput, { target: { value: -3 } });

    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    const errorText = screen.getByText(getUnsuitableRangeErrorRegex());

    expect(saveButton).toBeDisabled();
    expect(minInput).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('should not invalidate used range var having its range changed to still be appropriate for its use', async () => {
    loadTestData(import13);
    doRender(import13.variables[0].id);

    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: fieldName(Field.VAR_RANGE_MIN),
    });
    // user.type() seems not to work for negative numbers
    fireEvent.change(minInput, { target: { value: -3 } });

    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    const errorText = screen.queryByText(getUnsuitableRangeErrorRegex());

    expect(saveButton).not.toBeDisabled();
    expect(minInput).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
  });
});

const getUnsuitableRangeErrorRegex = () =>
  /variables which are in use in actions cannot have their ranges changed; this variable is used in actions\: ".+"/;

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
