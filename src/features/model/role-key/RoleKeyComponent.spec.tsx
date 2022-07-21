import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../App';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await clickRoleKeysSidebarSection();
  await clickCreateNewRoleKey();
});

const clickRoleKeysSidebarSection = async () => {
  const roleKeysSidebarSection =
    screen.getByText<HTMLButtonElement>('Role Keys');
  await user.click(roleKeysSidebarSection);
};

const clickCreateNewRoleKey = async () => {
  const createNewRoleKeyButton = screen.getByText('Create New Role Key');
  await user.click(createNewRoleKeyButton);
};

const getRoleKeyInputField = (): HTMLInputElement => {
  return screen.getByRole('textbox', { name: Field[Field.RK_ROLE_KEY] });
};

describe('role key component tests', () => {
  it('should handle create new', () => {
    const input = getRoleKeyInputField();

    expect(input.value).toBe('');
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate empty role key', async () => {
    const input = getRoleKeyInputField();
    await user.click(input);
    await user.tab();

    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty role key', async () => {
    const input = getRoleKeyInputField();
    await user.click(input);
    await user.keyboard('a');

    expect(input).not.toHaveClass('is-invalid');
  });
});
