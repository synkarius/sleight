import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';
import { InjectionContext } from '../../../di/injector-context';
import { appDefaultInjectionContext } from '../../../app-default-injection-context';
import { createRangeVariable } from './data/variable';
import { getVariableDomainMapper } from './data/variable-domain-mapper';
import { saveEditingVariable } from './variable-reducers';

const SAVE = 'Save';
const VARIABLE_1_NAME = 'VARIABLE_1_NAME';

let user: UserEvent;

beforeAll(() => {
  const variable = {
    ...createRangeVariable(),
    name: VARIABLE_1_NAME,
  };
  const variableDTO = getVariableDomainMapper().mapFromDomain(variable);
  store.dispatch(saveEditingVariable(variableDTO));
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <InjectionContext.Provider value={appDefaultInjectionContext}>
        <VariableParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('variable component tests', () => {
  it('should have a placeholder name', () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/text-var-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    const typeSelect = screen.getByRole('list', {
      name: Field[Field.VAR_TYPE_SELECT],
    });
    await user.selectOptions(typeSelect, VariableType.Enum.CHOICE);
    const saveButton = screen.getByText<HTMLButtonElement>(SAVE);
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate an already taken name', async () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.VAR_NAME],
    });
    await user.click(nameField);
    await user.type(nameField, VARIABLE_1_NAME);

    expect(nameField).toHaveClass('is-invalid');
  });
});
