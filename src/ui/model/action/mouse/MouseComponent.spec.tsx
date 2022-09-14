import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { getDefaultInjectionContext } from '../../../../di/app-default-injection-context';
import { InjectionContext } from '../../../../di/injector-context';
import { ActionParentComponent } from '../ActionParentComponent';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import { MouseActionType } from '../../../../data/model/action/mouse/mouse-action-type';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
  createRangeVariable,
  RangeVariable,
} from '../../../../data/model/variable/variable';
import { getRangeVariableDomainMapper } from '../../../../core/mappers/range-variable-domain-mapper';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { createSelector } from '../../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../../core/reducers/selector-reducers';
import { getChoiceVariableDomainMapper } from '../../../../core/mappers/choice-variable-domain-mapper';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
const CHOICE_VARIABLE_NAME = 'asdf-choice-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  // save variables
  const rangeVariable: RangeVariable = {
    ...createRangeVariable(),
    name: RANGE_VARIABLE_NAME,
  };
  const rangeVariableDTO =
    getRangeVariableDomainMapper().mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    name: CHOICE_VARIABLE_NAME,
    items: [createChoiceItem(choiceItemSelector)],
  };
  const choiceVariableDTO =
    getChoiceVariableDomainMapper().mapFromDomain(choiceVariable);
  store.dispatch(saveVariable(choiceVariableDTO));

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
  await user.selectOptions(actionTypeSelect, ActionType.Enum.MOUSE);
  const mouseActionTypeSelect = screen.getByRole('list', {
    name: Field[Field.AC_MOUSE_ACTION_TYPE],
  });
  await user.selectOptions(mouseActionTypeSelect, MouseActionType.Enum.CLICK);
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

describe('mouse action component tests', () => {
  it('should reset valid status on change mouse action type', async () => {
    await selectActionValueType(
      user,
      Field.AC_MOUSE_REPEAT_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_REPEAT_VAR],
    });
    await user.click(select);
    await user.tab();
    // is invalid at this point
    const mouseActionTypeSelect = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_ACTION_TYPE],
    });
    await user.selectOptions(mouseActionTypeSelect, MouseActionType.Enum.MOVE);
    // should be valid again

    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    expect(saveButton).not.toBeDisabled();
  });
});
