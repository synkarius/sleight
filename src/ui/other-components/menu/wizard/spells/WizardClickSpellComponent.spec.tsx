import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import App from '../../../../../App';
import { store } from '../../../../../app/store';
import { Field } from '../../../../../validation/validation-field';
import { saveContext } from '../../../../../core/reducers/context-reducers';
import { castJsonForTest } from '../../../../../test/utils/import-test-json-util';
import { context01 } from '../../../../../test/resources/context-01.json';
import { TEXT_BOX } from '../../../../../core/common/accessibility-roles';
import { MouseKey } from '../../../../../data/model/action/mouse/mouse-key';
import { fieldName } from '../../../../../validation/field-name';

const CONTEXT_1_NAME = 'chrome-context';

let user: UserEvent;

beforeAll(() => {
  user = userEvent.setup();
});

beforeEach(async () => {
  store.dispatch(saveContext(castJsonForTest(context01)));
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  await clickToGoToView('Wizard');
  // choose click wizard
  const makeButton =
    screen.getAllByText<HTMLButtonElement>('Make This Command')[2];
  await user.click(makeButton);
});

describe('click wizard tests', () => {
  it('context should be selectable', async () => {
    // select a context
    const contextSelect = screen.getByRole('list', {
      name: fieldName(Field.WIZ_MC_CONTEXT),
    });
    await user.selectOptions(contextSelect, CONTEXT_1_NAME);

    const option = screen.getByText<HTMLOptionElement>(CONTEXT_1_NAME);
    expect(option.selected).toBe(true);
  });

  it('context should be optional', async () => {
    // select a context
    const contextSelect = screen.getByRole('list', {
      name: fieldName(Field.WIZ_MC_CONTEXT),
    });
    await user.click(contextSelect);
    await user.tab();

    const finalizeButton = screen.getByText('Finalize');

    expect(finalizeButton).not.toBeDisabled();
    expect(contextSelect).not.toHaveClass('is-invalid');
  });

  it('invalid spec should be invalidated', async () => {
    const selectorInput = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.WIZ_MC_SPEC),
    });
    await user.type(selectorInput, '#');

    const finalizeButton = screen.getByText('Finalize');
    const errorText = screen.getByText(
      'selectors must only be alphabetic or spaces'
    );

    expect(finalizeButton).toBeDisabled();
    expect(selectorInput).toHaveClass('is-invalid');
    expect(errorText).toBeInTheDocument();
  });

  it('valid spec should not be invalidated', async () => {
    const selectorInput = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.WIZ_MC_SPEC),
    });
    await user.type(selectorInput, 'hi');

    const finalizeButton = screen.getByText('Finalize');

    expect(finalizeButton).not.toBeDisabled();
    expect(selectorInput).not.toHaveClass('is-invalid');
  });

  it('button should be selectable', async () => {
    const btnSelect = screen.getByRole('list', {
      name: fieldName(Field.WIZ_MC_BTN),
    });
    await user.selectOptions(btnSelect, MouseKey.Enum.MIDDLE);

    const option = screen.getByText<HTMLOptionElement>(MouseKey.Enum.MIDDLE);
    expect(option.selected).toBe(true);
  });

  it('finalize screen should list created elements', async () => {
    const selectorInput = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.WIZ_MC_SPEC),
    });
    await user.type(selectorInput, 'hi');

    const finalizeButton = screen.getByText('Finalize');
    await user.click(finalizeButton);

    const createdCommand = screen.getByText(wizGenComandRegex());
    const createdSpec = screen.getByText(wizGenSpecRegex());
    const createdAction = screen.getByText(wizGenActionRegex());

    expect(finalizeButton).not.toBeInTheDocument();
    expect(createdCommand).toBeInTheDocument();
    expect(createdSpec).toBeInTheDocument();
    expect(createdAction).toBeInTheDocument();
  });

  it("finalize should create command's elements", async () => {
    const selectorInput = screen.getByRole(TEXT_BOX, {
      name: fieldName(Field.WIZ_MC_SPEC),
    });
    await user.type(selectorInput, 'hi');

    const finalizeButton = screen.getByText('Finalize');
    await user.click(finalizeButton);

    await clickToGoToView('Element Editor');

    // assert that created command's elements show in editor
    // open element editor accordion items
    const commandsAccordionHeader = screen.getByText('Commands');
    await user.click(commandsAccordionHeader);
    const actionsAccordionHeader = screen.getByText('Actions');
    await user.click(actionsAccordionHeader);
    const specsAccordionHeader = screen.getByText('Specs');
    await user.click(specsAccordionHeader);
    // look for created elements
    const createdCommand = screen.getByText(wizGenComandRegex());
    const createdSpec = screen.getByText(wizGenSpecRegex());
    const createdAction = screen.getByText(wizGenActionRegex());

    expect(createdCommand).toBeInTheDocument();
    expect(createdSpec).toBeInTheDocument();
    expect(createdAction).toBeInTheDocument();
  });
});

const wizGenComandRegex = () => /WG Command \/ com-.+/;
const wizGenSpecRegex = () => /WG Spec \/ 'hi' \/ spe-.+/;
const wizGenActionRegex = () => /WG Action \/ mouse-act-.+/;

const clickToGoToView = async (view: string) => {
  const menuView = screen.getByText('View');
  await user.click(menuView);
  const viewItem = screen.getByText(view);
  await user.click(viewItem);
};
