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
import { rangeVariableDomainMapperDelegate } from '../variable/data/range-variable-domain-mapper';

let user: UserEvent;

const ROLE_KEY_NAME_1 = 'role-key-name-1';
const VARIABLE_NAME_1 = 'variable-name-1';
const SAVE = 'Save';
const ADD_NEW_SPEC_ITEM = 'Add New Spec Item';
const GTE1_ERROR_MESSAGE = 'at least one spec item must be added';

beforeAll(() => {
  const roleKey: RoleKey = { ...createRoleKey(), value: ROLE_KEY_NAME_1 };
  store.dispatch(saveRoleKey(roleKey));
  const rangeVariable = {
    ...createRangeVariable(),
    name: VARIABLE_NAME_1,
  };
  const rangeVariableDTO =
    rangeVariableDomainMapperDelegate.mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <SpecParentComponent />
    </Provider>
  );
});

describe('spec component tests', () => {
  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should show error message spec with no spec items', async () => {
    const saveButton = screen.getByRole('button', {
      name: SAVE,
    });
    await user.click(saveButton);
    const errorSpan = screen.getByText(GTE1_ERROR_MESSAGE);

    expect(errorSpan).toBeInTheDocument();
  });

  it('should validate spec with complete spec-type spec item', async () => {
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
});