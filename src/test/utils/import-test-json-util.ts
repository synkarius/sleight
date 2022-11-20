import { act } from 'react-dom/test-utils';
import { store } from '../../app/store';
import { saveAction } from '../../core/reducers/action-reducers';
import { saveCommand } from '../../core/reducers/command-reducers';
import { saveContext } from '../../core/reducers/context-reducers';
import { saveFn } from '../../core/reducers/fn-reducers';
import { saveSelector } from '../../core/reducers/selector-reducers';
import { saveSpec } from '../../core/reducers/spec-reducers';
import { saveVariable } from '../../core/reducers/variable-reducers';
import { container } from '../../di/config/brandi-config';
import { Tokens } from '../../di/config/brandi-tokens';

/** Test utility function: casts imported json. */
export const castJsonForTest = <T>(jsonObject: unknown): T => jsonObject as T;

export const loadTestData = (json: unknown) => {
  const formatMapper = container.get(Tokens.FormatMapper);
  const data = formatMapper.externalFormatToInternal(castJsonForTest(json));
  act(() => {
    Object.values(data.actions).forEach((action) =>
      store.dispatch(saveAction(action))
    );
    Object.values(data.commands).forEach((command) =>
      store.dispatch(saveCommand(command))
    );
    Object.values(data.contexts).forEach((context) =>
      store.dispatch(saveContext(context))
    );
    Object.values(data.fns).forEach((fn) => store.dispatch(saveFn(fn)));
    Object.values(data.selectors).forEach((selector) =>
      store.dispatch(saveSelector(selector))
    );
    Object.values(data.specs).forEach((spec) => store.dispatch(saveSpec(spec)));
    Object.values(data.variables).forEach((variable) =>
      store.dispatch(saveVariable(variable))
    );
  });
};
