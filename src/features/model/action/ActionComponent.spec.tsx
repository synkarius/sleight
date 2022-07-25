import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import App from '../../../App';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { ActionType } from './action-types';

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
  await clickActionsSidebarSection();
  await clickCreateNewAction();
});

const clickActionsSidebarSection = async () => {
  const actionsSidebarSection = screen.getByText<HTMLButtonElement>('Actions');
  await user.click(actionsSidebarSection);
};

const clickCreateNewAction = async () => {
  const createNewActionButton = screen.getByText('Create New Action');
  await user.click(createNewActionButton);
};

describe('action component tests', () => {
  it('should handle create new', () => {
    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });

    expect(input.value).toBe('');
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should reset valid status on change action type', async () => {
    const input = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.click(input);
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
});
