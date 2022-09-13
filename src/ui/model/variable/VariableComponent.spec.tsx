import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from '../../../data/model/variable/variable-types';
import { InjectionContext } from '../../../di/injector-context';
import { getDefaultInjectionContext } from '../../../di/app-default-injection-context';
import {
  createRangeVariable,
  RangeVariable,
} from '../../../data/model/variable/variable';
import { saveVariable } from '../../../core/reducers/variable-reducers';
import {
  createPauseAction,
  PauseAction,
} from '../../../data/model/action/pause/pause';
import { ActionValueType } from '../../../data/model/action/action-value/action-value-type';
import { saveAction } from '../../../core/reducers/action-reducers';

const SAVE = 'Save';
const VARIABLE_1_ID = 'VARIABLE_1_ID';
const VARIABLE_1_NAME = 'VARIABLE_1_NAME';
const VARIABLE_1_RK = 'VARIABLE_1_RK';
const VARIABLE_2_ID = 'VARIABLE_2_ID';
const VARIABLE_2_NAME = 'VARIABLE_2_NAME';

let user: UserEvent;

beforeAll(() => {
  const injected = getDefaultInjectionContext();
  const variableMapper = injected.mappers.variable;

  const variable1: RangeVariable = {
    ...createRangeVariable(),
    id: VARIABLE_1_ID,
    name: VARIABLE_1_NAME,
    roleKey: VARIABLE_1_RK,
  };
  const variable1DTO = variableMapper.mapFromDomain(variable1);
  store.dispatch(saveVariable(variable1DTO));
  const variable2 = {
    ...createRangeVariable(),
    id: VARIABLE_2_ID,
    name: VARIABLE_2_NAME,
  };
  const variable2DTO = variableMapper.mapFromDomain(variable2);
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

    const errorText = screen.getByText(
      'a variable already exists with this name'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(nameField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken role key', async () => {
    doRender();

    const roleKeyField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_ROLE_KEY],
    });
    await user.click(roleKeyField);
    await user.type(roleKeyField, VARIABLE_1_RK);

    const errorText = screen.getByText(
      'a variable already exists with this role key'
    );
    const saveButton = screen.getByRole('button', { name: 'Save' });

    expect(roleKeyField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
    expect(saveButton).toBeDisabled();
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

  it('should update enabled', async () => {
    doRender();

    const enabledSwitch = screen.getByLabelText('Enabled');
    expect(enabledSwitch).toBeChecked();
    await user.click(enabledSwitch);

    expect(enabledSwitch).not.toBeChecked();
  });

  it('should update locked', async () => {
    doRender();

    const lockedSwitch = screen.getByLabelText('Locked');
    expect(lockedSwitch).not.toBeChecked();
    await user.click(lockedSwitch);

    expect(lockedSwitch).toBeChecked();
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