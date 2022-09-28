import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { ActionParentComponent } from '../ActionParentComponent';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import { MouseActionType } from '../../../../data/model/action/mouse/mouse-action-type';
import {
  createRangeVariable,
  RangeVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { createSelector } from '../../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../../core/reducers/selector-reducers';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
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
  const actionTypeSelect = screen.getByRole('list', {
    name: Field[Field.AC_TYPE],
  });
  await user.selectOptions(actionTypeSelect, ActionType.Enum.MOUSE);
  const mouseActionTypeSelect = screen.getByRole('list', {
    name: Field[Field.AC_MOUSE_ACTION_TYPE],
  });
  await user.selectOptions(mouseActionTypeSelect, MouseActionType.Enum.MOVE);
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

describe('mouse move action component tests', () => {
  it('should invalidate non-selected x variable', async () => {
    await selectActionValueType(user, Field.AC_MOUSE_X_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_X_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('x value : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected x variable', async () => {
    await selectActionValueType(user, Field.AC_MOUSE_X_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_X_VAR],
    });
    await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected y variable', async () => {
    await selectActionValueType(user, Field.AC_MOUSE_Y_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_Y_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('y value : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected y variable', async () => {
    await selectActionValueType(user, Field.AC_MOUSE_Y_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MOUSE_Y_VAR],
    });
    await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
