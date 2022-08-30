import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { getDefaultInjectionContext } from '../../../../app-default-injection-context';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { createRoleKey } from '../../role-key/role-key';
import { saveRoleKey } from '../../role-key/role-key-reducers';
import { getRangeVariableDomainMapper } from '../../variable/data/range-variable-domain-mapper';
import { getTextVariableDomainMapper } from '../../variable/data/text-variable-domain-mapper-delegate';
import {
  createRangeVariable,
  createTextVariable,
} from '../../variable/data/variable';
import { saveEditingVariable } from '../../variable/variable-reducers';
import {
  VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE,
  VAR_FOR_RK_NOT_EXISTS,
} from '../action-value/action-value-validation';
import { ActionParentComponent } from '../ActionParentComponent';

const VARIABLE_NAME = 'asdf-range-var';
const RANGE_ROLE_KEY = 'rk-range';
const TEXT_ROLE_KEY = 'rk-text';
const OTHER_ROLE_KEY = 'rk-other';
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save role keys
  const rangeRoleKey = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...rangeRoleKey,
      value: RANGE_ROLE_KEY,
    })
  );
  const textRoleKey = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...textRoleKey,
      value: TEXT_ROLE_KEY,
    })
  );
  const otherRoleKey = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...otherRoleKey,
      value: OTHER_ROLE_KEY,
    })
  );
  // save variables
  const rangeVariable = {
    ...createRangeVariable(),
    name: VARIABLE_NAME,
    roleKeyId: rangeRoleKey.id,
  };
  const rangeVariableDTO =
    getRangeVariableDomainMapper().mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));
  const textVariable = {
    ...createTextVariable(),
    roleKeyId: textRoleKey.id,
  };
  const textVariableDTO =
    getTextVariableDomainMapper().mapFromDomain(textVariable);
  store.dispatch(saveEditingVariable(textVariableDTO));

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
    await user.selectOptions(select, [RANGE_ROLE_KEY]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate selected wrong-type inner pause role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_RK],
    });
    await user.selectOptions(select, [TEXT_ROLE_KEY]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('should invalidate selected inner pause role key attached to no variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_INNER_PAUSE_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_INNER_PAUSE_RK],
    });
    await user.selectOptions(select, [OTHER_ROLE_KEY]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_NOT_EXISTS);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
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
    await user.selectOptions(select, [RANGE_ROLE_KEY]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate selected wrong-type repeat role key', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, ROLE_KEY_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_RK],
    });
    await user.selectOptions(select, [TEXT_ROLE_KEY]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('should invalidate selected repeat role key attached to no variable', async () => {
    await selectActionValueType(user, Field.AC_REPEAT_RADIO, ROLE_KEY_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_REPEAT_RK],
    });
    await user.selectOptions(select, [OTHER_ROLE_KEY]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_NOT_EXISTS);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });
});
