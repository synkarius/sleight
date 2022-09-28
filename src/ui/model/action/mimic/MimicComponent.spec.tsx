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
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';

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
  await user.selectOptions(actionTypeSelect, ActionType.Enum.MIMIC);
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

describe('mimic action component tests', () => {
  it('should invalidate empty words value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: Field[Field.AC_MIMIC_WORDS_VALUE],
    });
    await user.click(input);
    await user.tab();

    const errorText = screen.getByText('words : value must be non-empty');

    expect(errorText).toBeInTheDocument();
    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty words value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: Field[Field.AC_MIMIC_WORDS_VALUE],
    });
    await user.click(input);
    await user.type(input, 'asdf');
    await user.tab();

    expect(input).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected words variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_MIMIC_WORDS_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MIMIC_WORDS_VAR],
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('words : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected words variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_MIMIC_WORDS_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: Field[Field.AC_MIMIC_WORDS_VAR],
    });
    await user.selectOptions(select, [TEXT_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
