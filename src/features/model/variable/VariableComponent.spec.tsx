import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../app-default-injection-context';
import { createRangeVariable } from './data/variable';
import { getVariableDomainMapper } from './data/variable-domain-mapper';
import { saveVariable } from './variable-reducers';
import { createPauseAction, PauseAction } from '../action/pause/pause';
import { ActionValueType } from '../action/action-value/action-value-type';
import { saveAction } from '../action/action-reducers';

const SAVE = 'Save';
const VARIABLE_1_ID = 'VARIABLE_1_ID';
const VARIABLE_1_NAME = 'VARIABLE_1_NAME';
const VARIABLE_2_ID = 'VARIABLE_2_ID';
const VARIABLE_2_NAME = 'VARIABLE_2_NAME';

let user: UserEvent;

beforeAll(() => {
  const variable1 = {
    ...createRangeVariable(),
    id: VARIABLE_1_ID,
    name: VARIABLE_1_NAME,
  };
  const variable1DTO = getVariableDomainMapper().mapFromDomain(variable1);
  store.dispatch(saveVariable(variable1DTO));
  const variable2 = {
    ...createRangeVariable(),
    id: VARIABLE_2_ID,
    name: VARIABLE_2_NAME,
  };
  const variable2DTO = getVariableDomainMapper().mapFromDomain(variable2);
  store.dispatch(saveVariable(variable2DTO));
  const action: PauseAction = {
    ...createPauseAction(),
    centiseconds: {
      variableType: VariableType.Enum.RANGE,
      actionValueType: ActionValueType.Enum.USE_VARIABLE,
      variableId: variable1.id,
    },
  };
  store.dispatch(saveAction(action));
  user = userEvent.setup();
});

beforeEach(async () => {});

describe('variable component tests', () => {
  it('should have a placeholder name', () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/text-var-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    doRender();

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken name', async () => {
    doRender();

    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, VARIABLE_1_NAME);

    expect(nameField).toHaveClass('is-invalid');
  });

  it('should invalidate type change if variable is used', async () => {
    doRender(VARIABLE_1_ID);

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);

    const errorText = screen.getByText(getVarUsedErrorMsgRegex());

    expect(typeSelect).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('should validate type change if variable is unused', async () => {
    doRender(VARIABLE_2_ID);

    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);

    const errorText = screen.queryByText(getVarUsedErrorMsgRegex());

    expect(typeSelect).not.toHaveClass('is-invalid');
    expect(errorText).not.toBeInTheDocument();
  });
});

const getVarUsedErrorMsgRegex = () =>
  /this variable is currently used \(in the action\(s\) ".*"\), so its type cannot be changed/;

const doRender = (variableId?: string) => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={getDefaultInjectionContext()}>
        <VariableParentComponent variableId={variableId} />
      </InjectionContext.Provider>
    </Provider>
  );
};
