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
import { createSelector } from '../../selector/data/selector-domain';
import { saveSelector } from '../../selector/selector-reducers';
import { getChoiceVariableDomainMapper } from '../../variable/data/choice-variable-domain-mapper';
import { getRangeVariableDomainMapper } from '../../variable/data/range-variable-domain-mapper';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
  createRangeVariable,
} from '../../variable/data/variable';
import { saveEditingVariable } from '../../variable/variable-reducers';
import { ActionType } from '../action-types';
import {
  VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE,
  VAR_FOR_RK_NOT_EXISTS,
} from '../action-value/action-value-validation';
import { ActionParentComponent } from '../ActionParentComponent';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
const CHOICE_VARIABLE_NAME = 'asdf-choice-var';
const RANGE_ROLE_KEY_1 = 'rk-range-1';
const CHOICE_ROLE_KEY_1 = 'rk-choice-1';
const OTHER_ROLE_KEY_1 = 'rk-other';
const VARIABLE_RADIO = 1;
const ROLE_KEY_RADIO = 2;
type Radio = 0 | 1 | 2;
let user: UserEvent;

beforeAll(() => {
  // save role keys
  const roleKeyRange = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...roleKeyRange,
      value: RANGE_ROLE_KEY_1,
    })
  );
  const roleKeyChoice = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...roleKeyChoice,
      value: CHOICE_ROLE_KEY_1,
    })
  );
  const roleKeyOther = createRoleKey();
  store.dispatch(
    saveRoleKey({
      ...roleKeyOther,
      value: OTHER_ROLE_KEY_1,
    })
  );
  // save variables
  const rangeVariable = {
    ...createRangeVariable(),
    name: RANGE_VARIABLE_NAME,
    roleKeyId: roleKeyRange.id,
  };
  const rangeVariableDTO =
    getRangeVariableDomainMapper().mapFromDomain(rangeVariable);
  store.dispatch(saveEditingVariable(rangeVariableDTO));
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    name: CHOICE_VARIABLE_NAME,
    roleKeyId: roleKeyChoice.id,
    items: [createChoiceItem(choiceItemSelector)],
  };
  const choiceVariableDTO =
    getChoiceVariableDomainMapper().mapFromDomain(choiceVariable);
  store.dispatch(saveEditingVariable(choiceVariableDTO));

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
  const actionTypeSelect = screen.getByRole('list', {
    name: Field[Field.AC_TYPE],
  });
  await user.selectOptions(actionTypeSelect, ActionType.Enum.PAUSE);
});

describe('pause action component tests', () => {
  it('should invalidate non-selected centiseconds variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_VAR],
    });
    await user.click(select);
    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected centiseconds variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_VAR],
    });
    await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected centiseconds role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_RK],
    });
    await user.click(select);

    await user.tab();

    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected centiseconds role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_RK],
    });
    await user.selectOptions(select, [RANGE_ROLE_KEY_1]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate selected wrong-type centiseconds role key', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_RK],
    });
    await user.selectOptions(select, [CHOICE_ROLE_KEY_1]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_EXISTS_BUT_WRONG_TYPE);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('should invalidate selected centiseconds role key attached to no variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_CENTISECONDS_RADIO,
      ROLE_KEY_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_CENTISECONDS_RK],
    });
    await user.selectOptions(select, [OTHER_ROLE_KEY_1]);
    await user.tab();
    const errorText = screen.getByText(VAR_FOR_RK_NOT_EXISTS);

    expect(select).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });
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
