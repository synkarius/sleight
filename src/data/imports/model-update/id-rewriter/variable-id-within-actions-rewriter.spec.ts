import { castJsonForTest } from '../../../../test/utils/import-test-json-util';
import { createSleightDataInternalFormat } from '../../../data-formats';
import { action01 } from '../../../../test/resources/action-01.json';
import { action03 } from '../../../../test/resources/action-03.json';
import { variable01 } from '../../../../test/resources/variable-01.json';
import { VariableDTO } from '../../../model/variable/variable-dto';
import { VariableIdWithinActionsRewriter } from './variable-id-within-actions-rewriter';
import { getPauseActionVariableIdsRewriterDelegate } from './action-variable-ids-rewriter-delegate/pause-action-variable-ids-rewriter-delegate';
import { PauseAction } from '../../../model/action/pause/pause';

describe('variable id rewriter tests', () => {
  it("should rewrite action's variable id", () => {
    const variableDTO: VariableDTO = castJsonForTest(variable01);
    const action1: PauseAction = castJsonForTest(action01);
    const action3: PauseAction = castJsonForTest(action03);
    const actions = { [action1.id]: action1, [action3.id]: action3 };
    const data = {
      ...createSleightDataInternalFormat(),
      actions,
    };
    const newId = 'newId';

    const rewriter = new VariableIdWithinActionsRewriter([
      getPauseActionVariableIdsRewriterDelegate(),
    ]);
    const rewrittenData = rewriter.rewriteId(variableDTO, newId, data);

    const expected = {
      ...createSleightDataInternalFormat(),
      actions: {
        [action1.id]: {
          ...action1,
          seconds: { ...action1.seconds, variableId: newId },
        },
        [action3.id]: action3,
      },
    };
    expect(rewrittenData).toEqual(expected);
  });
});
