import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { ContextParentComponent } from './ContextParentComponent';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <ContextParentComponent />
    </Provider>
  );
});

describe('context component tests', () => {
  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate empty matcher', async () => {
    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_MATCHER],
    });
    await user.click(input);
    await user.tab();

    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty role key', async () => {
    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_MATCHER],
    });
    await user.click(input);
    await user.keyboard('a');

    expect(input).not.toHaveClass('is-invalid');
  });
});
