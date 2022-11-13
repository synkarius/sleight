import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../../app/store';
import { InjectionContext } from '../../../../di/injector-context';
import { ActionComponent } from '../ActionComponent';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Field } from '../../../../validation/validation-field';
import { ActionType } from '../../../../data/model/action/action-types';
import {
  ChoiceVariable,
  createChoiceItem,
  createChoiceVariable,
} from '../../../../data/model/variable/variable';
import { saveVariable } from '../../../../core/reducers/variable-reducers';
import { createSelector } from '../../../../data/model/selector/selector-domain';
import { saveSelector } from '../../../../core/reducers/selector-reducers';
import { TEXT_BOX } from '../../../../core/common/accessibility-roles';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { BrowserRouter } from 'react-router-dom';
import { fieldName } from '../../../../validation/field-name';

const CHOICE_VARIABLE_NAME = 'asdf-choice-var';
const VARIABLE_RADIO = 1;
type Radio = 0 | 1;
let user: UserEvent;

beforeAll(() => {
  const choiceVariableMapper = container.get(
    Tokens.VariableMapperDelegate_Choice
  );

  // save variables
  const choiceItemSelector = createSelector();
  store.dispatch(saveSelector(choiceItemSelector));
  const choiceVariable: ChoiceVariable = {
    ...createChoiceVariable(),
    name: CHOICE_VARIABLE_NAME,
    items: [createChoiceItem(choiceItemSelector)],
  };
  const choiceVariableDTO = choiceVariableMapper.mapFromDomain(choiceVariable);
  store.dispatch(saveVariable(choiceVariableDTO));

  user = userEvent.setup();
});

beforeEach(async () => {
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
  await user.selectOptions(actionTypeSelect, ActionType.Enum.BRING_APP);
});

const selectActionValueType = async (
  user: UserEvent,
  field: Field,
  index: Radio
): Promise<void> => {
  const radioGroup = screen.getByRole('radiogroup', {
    name: fieldName(field),
  });
  const options = await within(radioGroup).findAllByRole('radio');
  await user.click(options[index]);
};

describe('bring app action component tests', () => {
  it('should invalidate empty app path value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.AC_BRING_PATH_VALUE),
    });
    await user.click(input);
    await user.tab();

    const errorText = screen.getByText('app path : value must be non-empty');

    expect(errorText).toBeInTheDocument();
    expect(input).toHaveClass('is-invalid');
  });

  it('should validate non-empty app path value', async () => {
    const input = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.AC_BRING_PATH_VALUE),
    });
    await user.click(input);
    await user.type(input, 'asdf');
    await user.tab();

    expect(input).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected app path variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_PATH_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_PATH_VAR),
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('app path : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected app path variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_PATH_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_PATH_VAR),
    });
    await user.selectOptions(select, [CHOICE_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected app title variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_TITLE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_TITLE_VAR),
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('app title : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected app title variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_TITLE_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_TITLE_VAR),
    });
    await user.selectOptions(select, [CHOICE_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });

  it('should invalidate non-selected start dir variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_START_DIR_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_START_DIR_VAR),
    });
    await user.click(select);
    await user.tab();

    const errorText = screen.getByText('start dir : variable must be selected');

    expect(errorText).toBeInTheDocument();
    expect(select).toHaveClass('is-invalid');
  });

  it('should validate selected start dir variable', async () => {
    await selectActionValueType(
      user,
      Field.AC_BRING_START_DIR_RADIO,
      VARIABLE_RADIO
    );
    const select = screen.getByRole('list', {
      name: fieldName(Field.AC_BRING_START_DIR_VAR),
    });
    await user.selectOptions(select, [CHOICE_VARIABLE_NAME]);
    await user.tab();

    expect(select).not.toHaveClass('is-invalid');
  });
});
