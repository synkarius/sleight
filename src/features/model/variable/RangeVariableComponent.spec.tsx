import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';
import { NUMBER_TEXT_BOX } from '../common/accessibility-roles';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <VariableParentComponent />
    </Provider>
  );
});

describe('range variable component tests', () => {
  it('should validate range var with max GTE min', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.RANGE);
    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: Field[Field.VAR_RANGE_MIN],
    });
    const maxInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: Field[Field.VAR_RANGE_MAX],
    });
    await user.clear(minInput);
    await user.clear(maxInput);
    await user.click(maxInput);
    await user.type(maxInput, '99');
    await user.tab();

    expect(maxInput).not.toHaveClass('is-invalid');
  });

  it('should invalidate range var with max LT min', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.RANGE);
    const minInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: Field[Field.VAR_RANGE_MIN],
    });
    const maxInput = screen.getByRole(NUMBER_TEXT_BOX, {
      name: Field[Field.VAR_RANGE_MAX],
    });
    await user.clear(minInput);
    await user.clear(maxInput);
    await user.click(minInput);
    await user.type(minInput, '99');
    await user.click(maxInput);
    await user.tab();

    expect(maxInput).toHaveClass('is-invalid');
  });
});
