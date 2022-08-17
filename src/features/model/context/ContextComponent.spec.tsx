import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { ContextParentComponent } from './ContextParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { appDefaultInjectionContext } from '../../../app-default-injection-context';
import { saveEditingContext } from './context-reducers';
import { createContext } from './context';

const CONTEXT_NAME = 'CONTEXT_NAME';

let user: UserEvent;

beforeAll(() => {
  store.dispatch(
    saveEditingContext({
      ...createContext(),
      name: CONTEXT_NAME,
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={appDefaultInjectionContext}>
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

    expect(nameField).toHaveClass('is-invalid');
  });
});
