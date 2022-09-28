import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { ContextParentComponent } from './ContextParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { saveContext } from '../../../core/reducers/context-reducers';
import { createContext } from '../../../data/model/context/context';
import { container } from '../../../di/config/brandi-config';

const CONTEXT_NAME = 'CONTEXT_NAME';
const ROLE_KEY = 'ROLE_KEY';

let user: UserEvent;

beforeAll(() => {
  store.dispatch(
    saveContext({
      ...createContext(),
      name: CONTEXT_NAME,
      roleKey: ROLE_KEY,
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <ContextParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('context component tests', () => {
  it('should have a placeholder name', () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/exe-con-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

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

  it('should invalidate an already taken name', async () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, CONTEXT_NAME);

    const errorText = screen.getByText(
      'a context already exists with this name'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken role key', async () => {
    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, ROLE_KEY);

    const errorText = screen.getByText(
      'a context already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should update enabled', async () => {
    const enabledSwitch = screen.getByLabelText('Enabled');
    expect(enabledSwitch).toBeChecked();
    await user.click(enabledSwitch);

    expect(enabledSwitch).not.toBeChecked();
  });

  it('should update locked', async () => {
    const lockedSwitch = screen.getByLabelText('Locked');
    expect(lockedSwitch).not.toBeChecked();
    await user.click(lockedSwitch);

    expect(lockedSwitch).toBeChecked();
  });
});
