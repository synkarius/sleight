import { render, screen } from '@testing-library/react';
import { store } from '../app/store';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import { Provider } from 'react-redux';
import { InjectionContext } from '../di/injector-context';
import { ContextParentComponent } from '../ui/model/context/ContextParentComponent';
import userEvent from '@testing-library/user-event';
import { Field } from './validation-field';
import { FieldValidator, ValidatorType } from './field-validator';
import { Context } from '../data/model/context/context';
import { alwaysTrue } from '../core/common/common-functions';
import { Tokens } from '../di/config/brandi-tokens';
import { container } from '../di/config/brandi-config';
import { BrowserRouter } from 'react-router-dom';

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

  if (container.capture) {
    container.capture();
  }
  container.bind(Tokens.Validators_Context).toConstant([testBrokenValidator]);

  render(
    <Provider store={store}>
      <InjectionContext.Provider value={container}>
        <ContextParentComponent />
      </InjectionContext.Provider>
    </Provider>,
    { wrapper: BrowserRouter }
  );
});

afterAll(() => {
  if (container.restore) {
    container.restore();
  }
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
