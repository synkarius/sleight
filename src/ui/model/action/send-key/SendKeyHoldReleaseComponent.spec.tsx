import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { getDefaultInjectionContext } from '../../../../di/app-default-injection-context';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { createSelector } from '../../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../../core/reducers/selector-reducers';
import { getChoiceVariableDomainMapper } from '../../../../core/mappers/choice-variable-domain-mapper';
import { getTextVariableDomainMapper } from '../../../../core/mappers/text-variable-domain-mapper-delegate';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
  createTextVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { ActionParentComponent } from '../ActionParentComponent';
import { SendKeyMode } from '../../../../data/model/action/send-key/send-key-modes';

const VARIABLE_NAME = 'asdf-range-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  // save variables
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    name: VARIABLE_NAME,
    items: [createChoiceItem(choiceItemSelector)],
  };
  const choiceVariableDTO =
    getChoiceVariableDomainMapper().mapFromDomain(choiceVariable);
  store.dispatch(saveVariable(choiceVariableDTO));
  const textVariable = createTextVariable();
  const textVariableDTO =
    getTextVariableDomainMapper().mapFromDomain(textVariable);
  store.dispatch(saveVariable(textVariableDTO));

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
  const sendKeyModeSelect = screen.getByRole('list', {
    name: Field[Field.AC_SEND_KEY_MODE],
  });
  await user.selectOptions(sendKeyModeSelect, SendKeyMode.Enum.HOLD_RELEASE);
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

describe('sendKeyHoldRelease action component tests', () => {
  it('should invalidate empty direction value', async () => {
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_DIRECTION_VALUE],
    });
    await user.click(select);

    await user.tab();

    const errorText = screen.getByText('direction : value must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate non-empty direction value', async () => {
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_DIRECTION_VALUE],
    });
    await user.click(select);

    await user.selectOptions(select, 'Up');
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected direction variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_DIRECTION_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_DIRECTION_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('direction : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected direction variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_DIRECTION_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_DIRECTION_VAR],
    });
    await user.selectOptions(select, [VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
