import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import { ActionComponent } from '../ActionComponent';
import { container } from '../../../../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { saveFn, setFns } from '../../../../core/reducers/fn-reducers';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { import03 } from '../../../../test/resources/import-call-function-03.json';
import {
  saveVariable,
  setVariables,
} from '../../../../core/reducers/variable-reducers';
import { fieldName } from '../../../../validation/field-name';

const TEXT_VAR_1_NAME = 'text-var-2141bbc2-1dcd';
const FN_1_NAME = 'fn1';
const VARIABLE_RADIO = 1;
const formatMapper = container.get(Tokens.FormatMapper);
let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  await setupTestData(import03);
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <ActionComponent />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
  const actionTypeSelect = screen.getByRole('list', {
    name: fieldName(Field.AC_TYPE),
  });
  await user.selectOptions(actionTypeSelect, ActionType.Enum.CALL_FUNCTION);
});

afterEach(async () => {
  store.dispatch(setFns({}));
  store.dispatch(setVariables({}));
});

describe('call function action component tests', () => {
  it('should invalidate non-selected fn', async () => {
    const fnSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_FN),
    });
    await user.click(fnSelect);
    await user.tab();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    const errorText = screen.getByText('a function must be selected');

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(fnSelect).toHaveClass('is-invalid');
  });

  it('should validate selected fn', async () => {
    const fnSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_FN),
    });
    await user.selectOptions(fnSelect, FN_1_NAME);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    const errorText = screen.queryByText('a function must be selected');

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
    expect(fnSelect).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected parameter variable', async () => {
    // select a fn
    const fnSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_FN),
    });
    await user.selectOptions(fnSelect, FN_1_NAME);

    // change the parameter to "Use Variable"
    const paramVarSelectRadio = screen.getAllByRole('radiogroup', {
      name: fieldName(Field.AC_CALL_FUNC_PARAMETER_RADIO),
    })[0];
    const options = await within(paramVarSelectRadio).getAllByRole('radio');
    await user.click(options[VARIABLE_RADIO]);

    // click on the variable select and then tab away
    const paramVarSelect = screen.getAllByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_PARAMETER_VAR),
    })[0];
    await user.click(paramVarSelect);
    await user.tab();

    const saveButton = screen.getByRole('button', { name: 'Save' });
    const errorText = screen.getByText('variable parameters must be selected');

    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
    expect(paramVarSelect).toHaveClass('is-invalid');
  });

  it('should validate selected parameter variable', async () => {
    // select a fn
    const fnSelect = screen.getByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_FN),
    });
    await user.selectOptions(fnSelect, FN_1_NAME);

    // change the parameter to "Use Variable"
    const paramVarSelectRadio = screen.getAllByRole('radiogroup', {
      name: fieldName(Field.AC_CALL_FUNC_PARAMETER_RADIO),
    })[0];
    const options = await within(paramVarSelectRadio).getAllByRole('radio');
    await user.click(options[VARIABLE_RADIO]);

    // select a variable
    const paramVarSelect = screen.getAllByRole('list', {
      name: fieldName(Field.AC_CALL_FUNC_PARAMETER_VAR),
    })[0];
    await user.selectOptions(paramVarSelect, TEXT_VAR_1_NAME);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    const errorText = screen.queryByText(
      'variable parameters must be selected'
    );

    expect(errorText).not.toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
    expect(paramVarSelect).not.toHaveClass('is-invalid');
  });
});

const setupTestData = async (jsonData: unknown) => {
  act(() => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(jsonData)
    );
    Object.values(data.fns).forEach((fn) => store.dispatch(saveFn(fn)));
    Object.values(data.variables).forEach((variable) =>
      store.dispatch(saveVariable(variable))
    );
  });
};
