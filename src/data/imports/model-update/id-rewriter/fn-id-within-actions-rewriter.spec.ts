import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { SleightDataInternalFormat } from '../../../data-formats';
import { import03 } from '../../../../test/resources/import-call-function-03.json';
import { container } from '../../../../di/config/brandi-config';
import { Tokens } from '../../../../di/config/brandi-tokens';
import { CallFunctionAction } from '../../../model/action/call-function/call-function';
import { FnIdWithinActionsRewriter } from './fn-id-within-actions-rewriter';

describe('fn id rewriter tests', () => {
  const formatMapper = container.get(Tokens.FormatMapper);

  it("should rewrite call function action's fn id", () => {
    const data = formatMapper.externalFormatToInternal(
      castJsonForTest(import03)
    );
    const action = Object.values(data.actions)[0] as CallFunctionAction;
    const fn = Object.values(data.fns)[0];
    const newId = 'newId';

    const rewriter = new FnIdWithinActionsRewriter();
    const rewrittenData = rewriter.rewriteId(fn.id, newId, data);

    const expected = {
      ...data,
      actions: {
        ...data.actions,
        [action.id]: {
          ...action,
          functionId: newId,
        },
      },
    };
    expect(rewrittenData).toEqual<SleightDataInternalFormat>(expected);
  });
});
