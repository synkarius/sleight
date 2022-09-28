import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { createSelector } from '../../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../../core/reducers/selector-reducers';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
  createRangeVariable,
  RangeVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { ActionParentComponent } from '../ActionParentComponent';
import { SendKeyMode } from '../../../../data/model/action/send-key/send-key-modes';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
const CHOICE_VARIABLE_NAME = 'asdf-choice-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  const variableMapper = container.get(Tokens.DomainMapper_Variable);

  // save variables
  const rangeVariable: RangeVariable = {
    ...createRangeVariable(),
    name: RANGE_VARIABLE_NAME,
  };
  const rangeVariableDTO = variableMapper.mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    name: CHOICE_VARIABLE_NAME,
    items: [createChoiceItem(choiceItemSelector)],
  };
  const choiceVariableDTO = variableMapper.mapFromDomain(choiceVariable);
  store.dispatch(saveVariable(choiceVariableDTO));

  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
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

describe('sendKey action component tests', () => {
  it('should invalidate empty key to send value', async () => {
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_KEY_TO_SEND_VALUE],
    });
    await user.click(select);

    await user.tab();
    const errorText = screen.getByText('key to send : value must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate non-empty key to send value', async () => {
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_KEY_TO_SEND_VALUE],
    });
    await user.click(select);

    await user.selectOptions(select, 'a (alpha)');
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected key to send variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_KEY_TO_SEND_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_KEY_TO_SEND_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText(
      'key to send : variable must be selected'
    );

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected key to send variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_KEY_TO_SEND_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_KEY_TO_SEND_VAR],
    });
    await user.selectOptions(select, [CHOICE_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected outer pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_OUTER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_OUTER_PAUSE_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText(
      'outer pause : variable must be selected'
    );

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected outer pause variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_OUTER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_SK_OUTER_PAUSE_VAR],
    });
    await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should reset valid status on change send key mode', async () => {
    await selectActionValueType(
      user,
      Field.AC_SK_OUTER_PAUSE_RADIO,
      VARIABLE_RADIO
    );
    const outerPauseSelect = screen.getByRole('list', {
      name: Field[Field.AC_SK_OUTER_PAUSE_VAR],
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
