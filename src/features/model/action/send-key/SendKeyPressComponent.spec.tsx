import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { appDefaultInjectionContext } from '../../../../app-default-injection-context';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { createRoleKey } from '../../role-key/role-key';
import { saveRoleKey } from '../../role-key/role-key-reducers';
import { rangeVariableDomainMapperDelegate } from '../../variable/data/range-variable-domain-mapper';
import { createRangeVariable } from '../../variable/data/variable';
import { saveEditingVariable } from '../../variable/variable-reducers';
import { ActionParentComponent } from '../ActionParentComponent';

const VARIABLE_NAME = 'asdf-range-var';
const ROLE_KEY_NAME = 'asdf-rk';
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save a variable
  const rangeVariable = {
    ...createRangeVariable(),
    name: VARIABLE_NAME,
  };
  const rangeVariableDTO =
    rangeVariableDomainMapperDelegate.mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));
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
      <InjectionContext.Provider value={appDefaultInjectionContext}>
        <ActionParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
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
