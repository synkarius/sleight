import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';

let user: UserEvent;

const SAVE = 'Save';

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

describe('variable component tests', () => {
  it('should not save if validation errors', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });
});
