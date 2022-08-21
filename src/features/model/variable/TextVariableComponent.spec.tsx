import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { VariableParentComponent } from './VariableParentComponent';
import { VariableType } from './variable-types';
import { NUMBER_TEXT_BOX, TEXT_BOX } from '../common/accessibility-roles';
import { InjectionContext } from '../../../di/injector-context';
import { appDefaultInjectionContext } from '../../../app-default-injection-context';

let user: UserEvent;

beforeAll(() => {
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

describe('text variable component tests', () => {
  it("should show default textbox when 'Use Default' is checked", async () => {
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.getByRole(TEXT_BOX, {
      name: Field[Field.VAR_TEXT_DEFAULT_VALUE],
    });

    expect(defaultInput).toBeVisible();
  });

  it("should hide default textbox when 'Use Default' is unchecked", async () => {
    const useDefaultCheckbox = screen.getByRole('checkbox', {
      name: 'Use Default',
    });
    await user.click(useDefaultCheckbox);
    await user.click(useDefaultCheckbox);
    const defaultInput = screen.queryByRole(TEXT_BOX, {
      name: Field[Field.VAR_TEXT_DEFAULT_VALUE],
    });

    expect(defaultInput).not.toBeInTheDocument();
  });
});
