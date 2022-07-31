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

const SPEC_NAME = 'asdf-spec';
const ROLE_KEY_NAME = 'asdf-rk';

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
});

const createTestReduxSpec = (selector: Selector) => {
  const spec = createSpec();
  const specItem = createSpecItem();
  return specDomainMapper.mapFromDomain({
    ...spec,
    items: [{ ...specItem, selector: selector }],
  });
};
