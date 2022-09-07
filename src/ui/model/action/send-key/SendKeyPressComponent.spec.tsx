import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { getDefaultInjectionContext } from '../../../../di/app-default-injection-context';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { getRangeVariableDomainMapper } from '../../../../core/mappers/range-variable-domain-mapper';
import { getTextVariableDomainMapper } from '../../../../core/mappers/text-variable-domain-mapper-delegate';
import {
  createRangeVariable,
  createTextVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { ActionParentComponent } from '../ActionParentComponent';

const VARIABLE_NAME = 'asdf-range-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  // save variables
  const rangeVariable = {
    ...createRangeVariable(),
    name: VARIABLE_NAME,
  };
  const rangeVariableDTO =
    getRangeVariableDomainMapper().mapFromDomain(rangeVariable);
  store.dispatch(saveVariable(rangeVariableDTO));
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
});
