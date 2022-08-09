import { render, screen } from '@testing-library/react';
import { UserEvent } from '@testing-library/user-event/dist/types/setup';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { store } from '../../../app/store';
import { Field } from '../../../validation/validation-field';
import { createRoleKey } from '../role-key/role-key';
import { saveRoleKey } from '../role-key/role-key-reducers';
import { createSelector, Selector } from '../selector/data/selector-domain';
import { saveSelector } from '../selector/selector-reducers';
import { saveEditingSpec } from '../spec/spec-reducers';
import { createSpec, createSpecItem } from '../spec/data/spec-domain';
import { specDomainMapper } from '../spec/data/spec-domain-mapper';
import { selectorDomainMapper } from '../selector/data/selector-domain-mapper';
import { CommandParentComponent } from './CommandParentComponent';
import { saveEditingContext } from '../context/context-reducers';
import { createContext } from '../context/context';

const SPEC_NAME = 'asdf-spec';
const ROLE_KEY_NAME = 'asdf-rk';
const CONTEXT_ID = 'asdf-ctx-id';
const CONTEXT_NAME = 'asdf-ctx-name';

let user: UserEvent;

beforeAll(() => {
  // save a spec
  const selector = createSelector();
  const selectorRedux = selectorDomainMapper.mapFromDomain(selector);
  store.dispatch(saveSelector(selectorRedux));
  const spec = createTestReduxSpec(selector);
  store.dispatch(
    saveEditingSpec({
      ...spec,
      name: SPEC_NAME,
    })
  );
  // save a role key
  store.dispatch(
    saveRoleKey({
      ...createRoleKey(),
      value: ROLE_KEY_NAME,
    })
  );
  // save a context
  store.dispatch(
    saveEditingContext({
      ...createContext(),
      id: CONTEXT_ID,
      name: CONTEXT_NAME,
    })
  );
  user = userEvent.setup();
});

beforeEach(async () => {
  render(
    <Provider store={store}>
      <CommandParentComponent />
    </Provider>
  );
});

describe('command component tests', () => {
  it('should have a placeholder name', () => {
    const nameField = screen.getByRole<HTMLInputElement>('textbox', {
      name: Field[Field.CMD_NAME],
    });

    expect(nameField).toHaveAttribute(
      'placeholder',
      expect.stringMatching(/com-[a-z0-9]{8}-[a-z0-9]{4}/)
    );
  });

  it('should not save if validation errors', async () => {
    const saveButton = screen.getByText<HTMLButtonElement>('Save');
    await user.click(saveButton);

    expect(saveButton).toBeDisabled();
  });

  it('should invalidate unselected spec', async () => {
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SPEC_SELECT],
    });
    await user.click(variableSelect);
    await user.tab();

    expect(variableSelect).toHaveClass('is-invalid');
  });

  it('should validate selected spec', async () => {
    const variableSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_SPEC_SPEC_SELECT],
    });
    await user.selectOptions(variableSelect, [SPEC_NAME]);
    await user.tab();

    expect(variableSelect).not.toHaveClass('is-invalid');
  });

  it('selected context should stick', async () => {
    const contextSelect = screen.getByRole<HTMLSelectElement>('list', {
      name: Field[Field.CMD_CONTEXT],
    });
    await user.selectOptions(contextSelect, [CONTEXT_NAME]);
    await user.tab();

    expect(contextSelect).toHaveValue(CONTEXT_ID);
  });
});

const createTestReduxSpec = (selector: Selector) => {
  const spec = createSpec();
  const specItem = createSpecItem();
  return specDomainMapper.mapFromDomain({
    ...spec,
    items: [{ ...specItem, selector: selector }],
  });
};
