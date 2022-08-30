import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { TEXT_BOX } from '../common/accessibility-roles';

let user: UserEvent;

const SAVE = 'Save';
const ADD_NEW_CHOICE_ITEM = 'Add Choice Item';
const GTE1_ERROR_MESSAGE = 'at least one choice item must be added';

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <VariableParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('choice variable component tests', () => {
  it('should show error message for choice var with no choice items', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).toBeInTheDocument();
  });

  it('should clear error status when choice items added', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
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
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
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
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
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
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
    const addChoiceItemButton = screen.getByText(ADD_NEW_CHOICE_ITEM);
    await user.click(addChoiceItemButton);
    const selectorInput = screen.getByRole('textbox', {
      name: Field[Field.VAR_CHOICE_ITEM_SELECTOR],
    });
    await user.type(selectorInput, '$');

    expect(selectorInput).toHaveClass('is-invalid');
  });

  it("should show default textbox when 'Use Default' is checked", async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
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
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
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
});
