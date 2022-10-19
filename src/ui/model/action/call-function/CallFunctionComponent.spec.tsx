import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import { ActionParentComponent } from '../ActionParentComponent';
import { container } from '../../../../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';
import { NotImplementedError } from '../../../../error/not-implemented-error';

const RANGE_VARIABLE_NAME = 'asdf-range-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <ActionParentComponent />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
  const actionTypeSelect = screen.getByRole('list', {
    name: Field[Field.AC_TYPE],
  });
  await user.selectOptions(actionTypeSelect, ActionType.Enum.CALL_FUNCTION);
});

describe('call function action component tests', () => {
  it('should invalidate non-selected parameter variable', async () => {
    // await selectActionValueType(
    //   user,
    //   Field.AC_CENTISECONDS_RADIO,
    //   VARIABLE_RADIO
    // );
    // const select = screen.getByRole('list', {
    //   name: Field[Field.AC_CENTISECONDS_VAR],
    // });
    // await user.click(select);
    // await user.tab();

    // const errorText = screen.getByText(
    //   'centiseconds : variable must be selected'
    // );

    // expect(errorText).toBeInTheDocument();
    // expect(select).toHaveClass('is-invalid');
    throw new NotImplementedError('CFA functional tests');
  });

  it('should validate selected parameter variable', async () => {
    // await selectActionValueType(
    //   user,
    //   Field.AC_CENTISECONDS_RADIO,
    //   VARIABLE_RADIO
    // );
    // const select = screen.getByRole('list', {
    //   name: Field[Field.AC_CENTISECONDS_VAR],
    // });
    // await user.selectOptions(select, [RANGE_VARIABLE_NAME]);

    // await user.tab();

    // expect(select).not.toHaveClass('is-invalid');
    throw new NotImplementedError('CFA functional tests');
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
