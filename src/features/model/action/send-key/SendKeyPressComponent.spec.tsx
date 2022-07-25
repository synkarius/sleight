import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { Field } from '../../../../validation/validation-field';
import { createRoleKey } from '../../role-key/role-key';
import { saveRoleKey } from '../../role-key/role-key-reducers';
import { createRange } from '../../variable/range/range';
import {
  clearEditingVariable,
  createNewEditingVariable,
  saveEditingVariable,
} from '../../variable/variable-reducers';

const VARIABLE_NAME = 'asdf-range-var';
const ROLE_KEY_NAME = 'asdf-rk';
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save a variable
  store.dispatch(
    createNewEditingVariable({
      ...createRange(),
      name: VARIABLE_NAME,
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

describe('sendKeyPress action component tests', () => {
  it('should invalidate non-selected inner pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_VAR],
    });
    await user.click(select);
    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected inner pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_VAR],
    });
    await user.selectOptions(select, [VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected inner pause role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_RK],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected inner pause role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_RK],
    });
    await user.selectOptions(select, [ROLE_KEY_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  // repeat

  it('should invalidate non-selected repeat variable', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_VAR],
    });
    await user.click(select);
    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected repeat variable', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_VAR],
    });
    await user.selectOptions(select, [VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected repeat role key', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, ROLE_KEY_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_RK],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected repeat role key', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, ROLE_KEY_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_RK],
    });
    await user.selectOptions(select, [ROLE_KEY_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
