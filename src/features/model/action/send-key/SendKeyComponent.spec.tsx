import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { Field } from '../../../../validation/validation-field';
import { createRoleKey } from '../../role-key/role-key';
import { saveRoleKey } from '../../role-key/role-key-reducers';
import { createSelector } from '../../selector/data/selector-domain';
import { saveSelector } from '../../selector/selector-reducers';
import { createChoice } from '../../variable/choice/choice';
import { createRange } from '../../variable/range/range';
import {
  clearEditingVariable,
  createNewEditingVariable,
  saveEditingVariable,
} from '../../variable/variable-reducers';
import { SendKeyMode } from './send-key-modes';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
const CHOICE_VARIABLE_NAME = 'asdf-choice-var';
const ROLE_KEY_NAME = 'asdf-rk';
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save variables
  store.dispatch(
    createNewEditingVariable({ ...createRange(), name: RANGE_VARIABLE_NAME })
  );
  store.dispatch(saveEditingVariable());
  store.dispatch(clearEditingVariable());
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  store.dispatch(
    createNewEditingVariable({
      ...createChoice(choiceItemSelector.id),
      name: CHOICE_VARIABLE_NAME,
    })
  );
  store.dispatch(saveEditingVariable());
  store.dispatch(clearEditingVariable());
  // save a role key
  store.dispatch(
    saveRoleKey({
      ...createRoleKey(),
      value: ROLE_KEY_NAME,
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  const sidebarSection = screen.getByText('Actions');
  await user.click(sidebarSection);
  const createButton = screen.getByText('Create New Action');
  await user.click(createButton);
});

const selectActionValueType = async (
  user: UserEvent,
  field: Field,
  index: Radio
): Promise<void> => {
  const radioGroup = screen.getByRole('radiogroup', {
    name: Field[field],
  });
  const options = await within(radioGroup).findAllByRole('radio');
  await user.click(options[index]);
};

describe('sendKey action component tests', () => {
  it('should invalidate empty key to send value', async () => {
    const input = screen.getByRole('textbox', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.click(input);

    await user.tab();

    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty key to send value', async () => {
    const input = screen.getByRole('textbox', {
      name: Field[Field.AC_KEY_TO_SEND_VALUE],
    });
    await user.click(input);

    await user.keyboard('a');

    expect(input).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected key to send variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_KEY_TO_SEND_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_KEY_TO_SEND_VAR],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected key to send variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_KEY_TO_SEND_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_KEY_TO_SEND_VAR],
    });
    await user.selectOptions(select, [CHOICE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected key to send role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_KEY_TO_SEND_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_KEY_TO_SEND_RK],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected key to send role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_KEY_TO_SEND_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_KEY_TO_SEND_RK],
    });
    await user.selectOptions(select, [ROLE_KEY_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected outer pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_OUTER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_OUTER_PAUSE_VAR],
    });
    await user.click(select);
    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected outer pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_OUTER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_OUTER_PAUSE_VAR],
    });
    await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected outer pause role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_OUTER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_OUTER_PAUSE_RK],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected outer pause role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_OUTER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_OUTER_PAUSE_RK],
    });
    await user.selectOptions(select, [ROLE_KEY_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should reset valid status on change send key mode', async () => {
    await selectActionValueType(
      user,
      Field.AC_OUTER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const outerPauseSelect = screen.getByRole('list', {
      name: Field[Field.AC_OUTER_PAUSE_RK],
    });
    await user.click(outerPauseSelect);
    await user.tab();
    // is invalid at this point
    const sendKeyModeSelect = screen.getByRole('list', {
      name: Field[Field.AC_SEND_KEY_MODE],
    });
    await user.selectOptions(sendKeyModeSelect, SendKeyMode.Enum.HOLD_RELEASE);
    // should be valid again

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    expect(saveButton).not.toBeDisabled();
  });
});