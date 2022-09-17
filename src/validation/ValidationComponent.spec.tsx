import { render, screen } from '@testing-library/react';
import { store } from '../app/store';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { getDefaultInjectionContext } from '../di/app-default-injection-context';
import { Injected, InjectionContext } from '../di/injector-context';
import { ContextParentComponent } from '../ui/model/context/ContextParentComponent';
import userEvent from '@testing-library/user-event';
import { Field } from './validation-field';
import { FieldValidator, ValidatorType } from './field-validator';
import { Context } from '../data/model/context/context';
import { alwaysTrue } from '../core/common/common-functions';

let user: UserEvent;

const CTX_MATCHER = Field.CTX_MATCHER;
const testBrokenValidator: FieldValidator<Context> = {
  validatorType: ValidatorType.FIELD,
  field: CTX_MATCHER,
  isApplicable: alwaysTrue,
  validate: () => {
    throw new Error();
  },
};

beforeAll(() => {
  user = userEvent.setup();

  const defaultInjectionContext = getDefaultInjectionContext();
  const testInjectionContext: Injected = {
    ...defaultInjectionContext,
    validation: {
      ...defaultInjectionContext.validation,
      validators: {
        ...defaultInjectionContext.validation.validators,
        context: [testBrokenValidator],
      },
    },
  };

  render(
    <Provider store={store}>
      <InjectionContext.Provider value={testInjectionContext}>
        <ContextParentComponent />
      </InjectionContext.Provider>
    </Provider>
  );
});

describe('validation component tests', () => {
  it('should handle validator errors gracefully, rather than crashing', async () => {
    const matcherField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CTX_MATCHER],
    });
    await user.click(matcherField);
    await user.tab();

    const errorText = screen.getByText('validation failed for CTX_MATCHER');

    expect(matcherField).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });
});
