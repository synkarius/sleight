import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { RoleKeyParentComponent } from './RoleKeyParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { saveRoleKey } from './role-key-reducers';

const RK_VALUE_1 = 'RK_VALUE_1';

let user: UserEvent;

beforeAll(() => {
  store.dispatch(saveRoleKey({ id: 'asdf', value: RK_VALUE_1 }));
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <RoleKeyParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

const getRoleKeyInputField = (): HTMLInputElement => {
  return screen.getByRole('textbox', { name: Field[Field.RK_ROLE_KEY] });
};

describe('role key component tests', () => {
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

  it('should invalidate duplicate role key', async () => {
    const input = getRoleKeyInputField();
    await user.click(input);
    await user.type(input, RK_VALUE_1);

    expect(input).toHaveClass('is-invalid');
  });
});
