import { act, render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { Field } from '../../../../validation/validation-field';
import { fieldName } from '../../../../validation/field-name';

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
  await clickThroughMenu('Edit', 'Preferences');
});

describe('preferences component tests', () => {
  it('should have a placeholder negativizer', () => {
    const negativizerField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.PREFS_NEGATIVIZER),
    });

    expect(negativizerField).toHaveAttribute(
      'placeholder',
      expect.stringMatching('minus')
    );
  });

  it('should not save if validation errors', async () => {
    const negativizerField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.PREFS_NEGATIVIZER),
    });
    await user.type(negativizerField, '#');

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should validate if valid', async () => {
    const negativizerField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.PREFS_NEGATIVIZER),
    });
    await user.clear(negativizerField);
    await user.type(negativizerField, 'hi');

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });

    expect(saveButton).not.toBeDisabled();
    expect(negativizerField).not.toHaveClass('is-invalid');
  });

  it('should invalidate blank negativizer', async () => {
    const negativizerField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.PREFS_NEGATIVIZER),
    });
    await user.clear(negativizerField);

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
    const errorSpan = screen.getByText('negativizer cannot be empty');

    expect(negativizerField).toHaveClass('is-invalid');
    expect(saveButton).toBeDisabled();
    expect(errorSpan).toBeInTheDocument();
  });

  it('should invalidate non-alphaspace negativizer', async () => {
    const negativizerField = screen.getByRole<HTMLInputElement>('textbox', {
      name: fieldName(Field.PREFS_NEGATIVIZER),
    });
    await user.type(negativizerField, '#');

    const saveButton = screen.getByRole('button', {
      name: 'Save',
    });
    const errorSpan = screen.getByText(
      'negativizer may only contain alphabet characters and spaces'
    );

    expect(negativizerField).toHaveClass('is-invalid');
    expect(saveButton).toBeDisabled();
    expect(errorSpan).toBeInTheDocument();
  });
});

const clickThroughMenu = async (menu: string, menuItem: string) => {
  const menuView = screen.getByText(menu);
  await user.click(menuView);
  const menuPreferences = screen.getByText(menuItem);
  await user.click(menuPreferences);
};
