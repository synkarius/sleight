import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../../../App';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';

beforeEach(() => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
});

const clickRoleKeysSidebarSection = () => {
  const roleKeysSidebarSection =
    screen.getByText<HTMLButtonElement>('Role Keys');
  fireEvent.click(roleKeysSidebarSection);
};

const clickCreateNewRoleKey = () => {
  const createNewRoleKeyButton = screen.getByText('Create New Role Key');
  fireEvent.click(createNewRoleKeyButton);
};

const getRoleKeyInputField = (): HTMLInputElement => {
  const qs = `input[name="${Field[Field.RK_ROLE_KEY]}"]`;
  return document.querySelector<HTMLInputElement>(qs) as HTMLInputElement;
};

describe('role key component tests', () => {
  it('should handle create new', () => {
    clickRoleKeysSidebarSection();
    clickCreateNewRoleKey();

    const input = getRoleKeyInputField();

    expect(input?.value).toBe('');
  });

  it('should not save if validation errors', () => {
    clickRoleKeysSidebarSection();
    clickCreateNewRoleKey();
    // there will be a validation error for the role key being empty

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    fireEvent.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate empty role key', () => {
    clickRoleKeysSidebarSection();
    clickCreateNewRoleKey();

    const input = getRoleKeyInputField();
    fireEvent.blur(input);

    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty role key', () => {
    clickRoleKeysSidebarSection();
    clickCreateNewRoleKey();

    const input = getRoleKeyInputField();
    fireEvent.change(input, { target: { value: 'a' } });

    expect(input).not.toHaveClass('is-invalid');
  });
});
