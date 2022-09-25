import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { ActionParentComponent } from '../ActionParentComponent';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import {
  createTextVariable,
  TextVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { TEXT_BOX } from '../../../../core/common/accessibility-roles';
import { container } from '../../../../di/brandi-config';
import { Tokens } from '../../../../di/brandi-tokens';

const TEXT_VARIABLE_NAME = 'asdf-text-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  const variableMapper = container.get(Tokens.DomainMapper_Variable);

  // save variables
  const textVariable: TextVariable = {
    ...createTextVariable(),
    name: TEXT_VARIABLE_NAME,
  };
  const textVariableDTO = variableMapper.mapFromDomain(textVariable);
  store.dispatch(saveVariable(textVariableDTO));

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
  await user.selectOptions(actionTypeSelect, ActionType.Enum.SEND_TEXT);
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

describe('send text action component tests', () => {
  it('should invalidate empty text value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: Field[Field.AC_ST_TEXT_VALUE],
    });
    await user.click(input);
    await user.tab();

    const errorText = screen.getByText('text : value must be non-empty');

    expect(errorText).toBeInTheDocument();
    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty text value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: Field[Field.AC_ST_TEXT_VALUE],
    });
    await user.click(input);
    await user.type(input, 'asdf');
    await user.tab();

    expect(input).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected text variable', async () => {
    await selectActionValueType(user, Field.AC_ST_TEXT_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_ST_TEXT_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('text : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected text variable', async () => {
    await selectActionValueType(user, Field.AC_ST_TEXT_RADIO, VARIABLE_RADIO);
    const select = screen.getByRole('list', {
      name: Field[Field.AC_ST_TEXT_VAR],
    });
    await user.selectOptions(select, [TEXT_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
