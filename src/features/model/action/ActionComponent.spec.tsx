import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { ActionType } from './action-types';
import { ActionParentComponent } from './ActionParentComponent';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { saveAction } from './action-reducers';
import { createNumericValue } from './action-value/action-value';

const ACTION_1_NAME = 'ACTION_1_NAME';

let user: UserEvent;

beforeAll(() => {
  store.dispatch(
    saveAction({
      id: 'asdf',
      name: ACTION_1_NAME,
      type: ActionType.Enum.PAUSE,
      centiseconds: createNumericValue(),
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <ActionParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('action component tests', () => {
  it('should have a placeholder name', () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/send-key-act-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should reset valid status on change action type', async () => {
    const select = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.click(select);
    await user.tab();
    // is invalid at this point
    const actionTypeSelect = screen.getByRole('list', {
      name: Field[Field.AC_TYPE],
    });
    await user.selectOptions(actionTypeSelect, ActionType.Enum.PAUSE);
    // should be valid again

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    expect(saveButton).not.toBeDisabled();
  });

  it('should invalidate an already taken name', async () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, ACTION_1_NAME);

    expect(nameField).toHaveClass('is-invalid');
  });
});
