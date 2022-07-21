import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import App from '../../../../App';
import { store } from '../../../../app/store';
import { Field } from '../../../../validation/validation-field';
import { createRoleKey } from '../../role-key/role-key';
import { saveRoleKey } from '../../role-key/role-key-reducers';
import { createSelector } from '../../selector/selector';
import { createNewSelector } from '../../selector/selector-reducers';
import { createChoice } from '../../variable/choice/choice';
import {
  clearEditingVariable,
  createNewEditingVariable,
  saveEditingVariable,
} from '../../variable/variable-reducers';

const VARIABLE_NAME = 'asdf-choice-var';
const ROLE_KEY_NAME = 'asdf-rk';
const VALUE_RADIO = 0;
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save a variable
  const choiceItemSelector = createSelector();
  store.dispatch(createNewSelector(choiceItemSelector));
  const variable = createChoice(choiceItemSelector.id);
  variable.name = VARIABLE_NAME;
  // save a role key
  store.dispatch(createNewEditingVariable(variable));
  store.dispatch(saveEditingVariable());
  store.dispatch(clearEditingVariable());
  const roleKey = createRoleKey();
  roleKey.value = ROLE_KEY_NAME;
  store.dispatch(saveRoleKey(roleKey));
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await openSidebarSection(user, 'Action');
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

const openSidebarSection = async <T extends HTMLElement>(
  user: UserEvent,
  sectionName: string
): Promise<void> => {
  const sidebarSection = screen.getByText<T>(`${sectionName}s`);
  await user.click(sidebarSection);
  const createButton = screen.getByText(`Create New ${sectionName}`);
  await user.click(createButton);
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
    await user.selectOptions(select, [VARIABLE_NAME]);

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
});
